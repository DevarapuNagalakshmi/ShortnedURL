import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const RedirectHandler = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setIsLoading(false);
        return;
      }

      try {
        // Find the URL by short code
        const { data: urlData, error: fetchError } = await supabase
          .from('urls')
          .select('*')
          .eq('short_code', shortCode)
          .single();

        if (fetchError || !urlData) {
          setError('URL not found');
          setIsLoading(false);
          return;
        }

        // Increment click count
        const { error: updateError } = await supabase
          .from('urls')
          .update({ clicks: urlData.clicks + 1 })
          .eq('id', urlData.id);

        if (updateError) {
          console.error('Error updating click count:', updateError);
        }

        // Redirect to the original URL
        window.location.href = urlData.original_url;
      } catch (error) {
        console.error('Error in redirect handler:', error);
        setError('An error occurred while redirecting');
        setIsLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-xl text-white/80 mb-6">{error}</p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectHandler;