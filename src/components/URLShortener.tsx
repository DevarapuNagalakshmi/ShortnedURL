import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Copy, Link, ExternalLink, TrendingUp } from 'lucide-react';

interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

const URLShortener = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([]);

  // Validate URL
  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Generate random short code
  const generateShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Handle URL shortening
  const handleShorten = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid HTTP or HTTPS URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For now, we'll store in memory - will integrate Supabase next
      const shortCode = generateShortCode();
      const newShortenedUrl: ShortenedURL = {
        id: Date.now().toString(),
        originalUrl: url,
        shortCode,
        clicks: 0,
        createdAt: new Date().toISOString(),
      };

      setShortenedUrls(prev => [newShortenedUrl, ...prev]);
      setUrl('');

      toast({
        title: "Success!",
        description: "URL has been shortened successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Link className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">URL Shortener</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Shorten Your
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Long URLs
            </span>
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your lengthy URLs into clean, shareable links. Track clicks, 
            manage your links, and make sharing effortless.
          </p>
        </div>

        {/* URL Shortener Form */}
        <Card className="max-w-4xl mx-auto p-8 bg-white/95 backdrop-blur-sm shadow-strong border-0 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Enter your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                className="h-14 text-lg border-border/50 focus:border-primary shadow-soft"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleShorten}
              disabled={isLoading}
              variant="gradient"
              size="lg"
              className="h-14 px-8 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Shortening...
                </>
              ) : (
                <>
                  <Link className="w-5 h-5" />
                  Shorten URL
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Shortened URLs List */}
        {shortenedUrls.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Your Shortened URLs
            </h2>
            
            <div className="space-y-4">
              {shortenedUrls.map((item) => {
                const shortUrl = `${window.location.origin}/${item.shortCode}`;
                
                return (
                  <Card key={item.id} className="p-6 bg-white/95 backdrop-blur-sm shadow-medium border-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Original URL</span>
                        </div>
                        <p className="text-foreground truncate mb-3" title={item.originalUrl}>
                          {item.originalUrl}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Link className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Short URL</span>
                        </div>
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          {shortUrl}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{item.clicks}</div>
                          <div className="text-xs text-muted-foreground">clicks</div>
                        </div>
                        
                        <Button
                          onClick={() => copyToClipboard(shortUrl)}
                          variant="copy"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast & Reliable</h3>
              <p className="text-white/80">Generate short URLs instantly with our optimized system</p>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Click Tracking</h3>
              <p className="text-white/80">Monitor and analyze your link performance</p>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Copy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Sharing</h3>
              <p className="text-white/80">Copy and share your links with one click</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLShortener;