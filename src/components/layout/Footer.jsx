import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-secondary text-secondary-foreground mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            About Catalozy
                        </h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>
                                <Link to="/about" className="hover:opacity-100">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/careers"
                                    className="hover:opacity-100"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to="/press" className="hover:opacity-100">
                                    Press
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>
                                <Link
                                    to="/catalog?category=fashion"
                                    className="hover:opacity-100"
                                >
                                    Fashion
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/catalog?category=electronics"
                                    className="hover:opacity-100"
                                >
                                    Electronics
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/catalog?category=food"
                                    className="hover:opacity-100"
                                >
                                    Food & Beverage
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/catalog?category=crafts"
                                    className="hover:opacity-100"
                                >
                                    Handmade Crafts
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>
                                <Link to="/help" className="hover:opacity-100">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:opacity-100"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/seller"
                                    className="hover:opacity-100"
                                >
                                    Become a Seller
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>
                                <Link to="/terms" className="hover:opacity-100">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="hover:opacity-100"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/refund"
                                    className="hover:opacity-100"
                                >
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/20 mt-8 pt-8 text-center text-sm opacity-75">
                    <p>© 2025 Catalozy, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
