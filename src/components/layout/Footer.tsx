import { Link } from "react-router-dom";
export default function Footer() {
  return <footer className="bg-mediBridge-navy text-white py-[10px]">
      <div className="container px-4 mx-auto md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">MediBridge</h3>
            <p className="text-sm text-gray-300">
              Connecting You to Hospitals and Ambulances in Emergencies
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-mediBridge-teal">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-mediBridge-teal">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          
        </div>
        
        <div className="pt-8 mt-8 text-sm text-center text-gray-300 border-t border-gray-700 my-0 py-[9px]">
          &copy; {new Date().getFullYear()} MediBridge. All rights reserved.
        </div>
      </div>
    </footer>;
}