-- User-created curriculums: let learners plan their own short curriculums.
-- creator_id NULL  => official/operator curriculum (existing behavior)
-- creator_id set   => user-created curriculum
-- visibility       => 'private' (default) only owner sees it, 'public' shared

ALTER TABLE curriculums
  ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('private', 'public'));

CREATE INDEX IF NOT EXISTS idx_curriculums_creator_id ON curriculums(creator_id);

-- Tighten curriculum visibility: official curriculums and public user
-- curriculums are visible to everyone; private ones only to their creator.
DROP POLICY IF EXISTS "Curriculums are viewable by everyone" ON curriculums;
CREATE POLICY "Curriculums are viewable when official, public, or owned"
  ON curriculums FOR SELECT
  USING (
    creator_id IS NULL
    OR visibility = 'public'
    OR creator_id = auth.uid()
  );

DROP POLICY IF EXISTS "Curriculum items are viewable by everyone" ON curriculum_items;
CREATE POLICY "Curriculum items follow curriculum visibility"
  ON curriculum_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM curriculums c
      WHERE c.id = curriculum_items.curriculum_id
        AND (c.creator_id IS NULL OR c.visibility = 'public' OR c.creator_id = auth.uid())
    )
  );

-- Users can manage their own curriculums
CREATE POLICY "Users can create own curriculums"
  ON curriculums FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update own curriculums"
  ON curriculums FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Users can delete own curriculums"
  ON curriculums FOR DELETE
  USING (creator_id = auth.uid());

-- Users can manage items inside curriculums they own
CREATE POLICY "Users can insert items in own curriculums"
  ON curriculum_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM curriculums c
      WHERE c.id = curriculum_items.curriculum_id
        AND c.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in own curriculums"
  ON curriculum_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM curriculums c
      WHERE c.id = curriculum_items.curriculum_id
        AND c.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items in own curriculums"
  ON curriculum_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM curriculums c
      WHERE c.id = curriculum_items.curriculum_id
        AND c.creator_id = auth.uid()
    )
  );
