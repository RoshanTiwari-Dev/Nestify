import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground py-10 mt-10 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/">
              <a className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663490327936/TzN54ThndsQfyZ4yvrXWYy/nestify-logo-new-XhSiiisGWjWosbbbN2nk93.webp"
                  alt="Nestify Logo"
                  className="h-8 w-8"
                />
                <span>Nestify</span>
              </a>
            </Link>
            <p className="mt-4 max-w-md text-muted-foreground text-sm">
              Finding your perfect PG or hostel, made easy. Your home away from home starts here.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/"><a className="hover:text-primary transition-colors">Home</a></Link>
              </li>
              <li>
                <Link href="/dashboard"><a className="hover:text-primary transition-colors">Dashboard</a></Link>
              </li>
              <li>
                <Link href="/my-properties"><a className="hover:text-primary transition-colors">My Properties</a></Link>
              </li>
              <li>
                <Link href="/bookings"><a className="hover:text-primary transition-colors">Bookings</a></Link>
              </li>
              <li>
                <Link href="/messages"><a className="hover:text-primary transition-colors">Messages</a></Link>
              </li>
              <li>
                <Link href="/reviews"><a className="hover:text-primary transition-colors">Reviews</a></Link>
              </li>
              <li>
                <Link href="/wishlist"><a className="hover:text-primary transition-colors">Wishlist</a></Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-semibold text-foreground mb-4">Contact Us</h4>
            <p className="text-muted-foreground text-sm">
              Email: support@nestify.com
            </p>
            <p className="text-muted-foreground text-sm">
              Phone: +91 12345 67890
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          &copy; {currentYear} Nestify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
