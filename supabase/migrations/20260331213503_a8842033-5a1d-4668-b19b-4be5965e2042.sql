
CREATE TABLE public.saved_menus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  menu_title TEXT NOT NULL,
  menu_data JSONB NOT NULL,
  guests INTEGER,
  ingredients TEXT,
  effort TEXT,
  skill TEXT,
  cuisine TEXT,
  total_estimated_cost NUMERIC,
  total_pantry_savings NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own menus"
ON public.saved_menus FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own menus"
ON public.saved_menus FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own menus"
ON public.saved_menus FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
