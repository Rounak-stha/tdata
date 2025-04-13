import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-12 md:py-16">
      <div className="landing-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="mb-6">
              <a href="#" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/10 bg-clip-text text-transparent">
                Tdata
              </a>
            </div>
            <p className="text-muted-foreground mb-6">Project management that adapts to your workflow.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Customers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-tdata-dark-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Tdata. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
