import { Zap, Package, Palette, Server, Shield, Search, BookOpen, FileText } from 'lucide-react';

interface FooterProps {
  "data-theme"?: string;
}

const Footer = ({ "data-theme": dataTheme }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border/20" data-theme={dataTheme}>
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-x-12">
          
          {/* Services Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="/services/speed-optimization" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Speed Optimization
                </a>
              </li>
              <li>
                <a href="/services/custom-development" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Custom Development
                </a>
              </li>
              <li>
                <a href="/services/speed-optimization#packages" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Performance Audit
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* WordPress Resources Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">WordPress</h3>
            <ul className="space-y-3">
              <li>
                <a href="/wordpress-themes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Themes
                </a>
              </li>
              <li>
                <a href="/wordpress-blocks" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Block Plugins
                </a>
              </li>
              <li>
                <a href="/wordpress-pagebuilder" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Page Builders
                </a>
              </li>
              <li>
                <a href="/wordpress-hosting" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Hosting
                </a>
              </li>
              <li>
                <a href="/wordpress-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* WooCommerce Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">WooCommerce</h3>
            <ul className="space-y-3">
              <li>
                <a href="/woocommerce-themes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  WooCommerce Themes
                </a>
              </li>
              <li>
                <a href="/woocommerce-plugins" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  WooCommerce Plugins
                </a>
              </li>
              <li>
                <a href="/woocommerce-hosting" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  WooCommerce Hosting
                </a>
              </li>
              <li>
                <a href="/compare" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Compare Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-border/20 pt-8">
          
          {/* Bottom Footer */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            
            {/* Branding */}
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">WooThatsFast</span>
              <span className="text-sm text-muted-foreground">
                • Lightning-Fast WordPress & WooCommerce Solutions
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a 
                href="https://twitter.com/woothatfast" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                  <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
                </svg>
              </a>
              
              <a 
                href="https://github.com/woothatfast" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com/company/woothatfast" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} WooThatsFast. All rights reserved. Built with ❤️ for the WordPress community.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };