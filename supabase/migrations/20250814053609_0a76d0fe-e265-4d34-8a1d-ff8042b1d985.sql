-- Create table for storing shortened URLs
CREATE TABLE public.urls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.urls ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "URLs are viewable by everyone" 
ON public.urls 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create URLs" 
ON public.urls 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update click counts" 
ON public.urls 
FOR UPDATE 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_urls_short_code ON public.urls(short_code);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_urls_updated_at
BEFORE UPDATE ON public.urls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();