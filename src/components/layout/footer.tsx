import React from "react";
import Link from "next/link";
import { Package, Leaf, Recycle, TreePine } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Pack<span className="text-emerald-400">Craft</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Custom packaging solutions for brands that care about
              sustainability and presentation. From small orders to enterprise
              volumes.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Leaf className="w-4 h-4" />
                <span>FSC Certified</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Recycle className="w-4 h-4" />
                <span>100% Recyclable</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products?category=mailer" className="hover:text-white transition-colors">Mailer Boxes</Link></li>
              <li><Link href="/products?category=shipping" className="hover:text-white transition-colors">Shipping Boxes</Link></li>
              <li><Link href="/products?category=rigid" className="hover:text-white transition-colors">Rigid Boxes</Link></li>
              <li><Link href="/products?category=bags" className="hover:text-white transition-colors">Paper Bags</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Enterprise</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/plus/submit-brief" className="hover:text-white transition-colors">Packhelp Plus</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Request a Quote</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Warehousing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Split Shipments</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Sustainability</h3>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TreePine className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-white">Our Impact</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Trees Planted</span>
                  <span className="text-emerald-400 font-medium">12,450+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CO2 Offset</span>
                  <span className="text-emerald-400 font-medium">89 tonnes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recycled Material</span>
                  <span className="text-emerald-400 font-medium">156 tonnes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} PackCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
