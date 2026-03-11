import Link from 'next/link';
import { Car, Users, Leaf, DollarSign, Clock, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pnw-gold/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-pnw-gold">Pride Share</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              Purdue Northwest Carpool Network
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Find classmates heading to campus from your neighborhood
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signup"
                className="bg-pnw-gold text-black font-bold px-8 py-4 rounded-lg hover:bg-yellow-500 transition-all transform hover:scale-105 text-lg flex items-center justify-center gap-2"
              >
                <Users size={24} />
                Join Now - It's Free
              </Link>
              
              <a
                href="#how-it-works"
                className="border-2 border-pnw-gold text-pnw-gold font-bold px-8 py-4 rounded-lg hover:bg-pnw-gold hover:text-black transition-all text-lg"
              >
                Learn More
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-pnw-gold">100+</div>
                <div className="text-sm text-gray-400">Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pnw-gold">$500+</div>
                <div className="text-sm text-gray-400">Saved on Gas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pnw-gold">50+</div>
                <div className="text-sm text-gray-400">Rides Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Pride Share?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <DollarSign className="text-pnw-gold mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Save Money</h3>
            <p className="text-gray-400">
              Split gas and parking costs. Save $30-50 per month on your commute.
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Leaf className="text-pnw-gold mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Reduce Emissions</h3>
            <p className="text-gray-400">
              Help the environment by reducing CO₂ emissions. Every carpool counts.
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Users className="text-pnw-gold mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Make Friends</h3>
            <p className="text-gray-400">
              Connect with classmates and build lasting friendships on your commute.
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Clock className="text-pnw-gold mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
            <p className="text-gray-400">
              Find students with the same class schedule and route as you.
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Shield className="text-pnw-gold mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">PNW Verified</h3>
            <p className="text-gray-400">
              All users verified with @pnw.edu email. Your safety is our priority.
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Car className="text-pnw-gold mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Flexible Roles</h3>
            <p className="text-gray-400">
              Offer rides, find rides, or both. You're in control.
            </p>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div id="how-it-works" className="bg-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pnw-gold text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Sign Up</h3>
              <p className="text-gray-400">
                Create your account with your @pnw.edu email and add your class schedule.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-pnw-gold text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Get Matched</h3>
              <p className="text-gray-400">
                We'll find students with overlapping schedules heading from your area.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-pnw-gold text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Start Carpooling</h3>
              <p className="text-gray-400">
                Connect with your matches, coordinate rides, and start saving!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Save Money?</h2>
        <p className="text-xl text-gray-400 mb-8">
          Join 100+ PNW students already carpooling
        </p>
        <Link
          href="/signup"
          className="inline-block bg-pnw-gold text-black font-bold px-12 py-4 rounded-lg hover:bg-yellow-500 transition-all transform hover:scale-105 text-xl"
        >
          Get Started Now →
        </Link>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">
          <p>© 2025 Pride Share - Purdue Northwest</p>
          <p className="text-sm mt-2">Built by students, for students 🎓</p>
        </div>
      </div>
    </div>
  );
}
