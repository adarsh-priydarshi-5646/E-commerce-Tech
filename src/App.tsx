import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

const products = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Audio',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    category: 'Wearables',
  },
  {
    id: 3,
    name: 'Wireless Speaker',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    category: 'Audio',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80',
    category: 'Accessories',
  },
  {
    id: 5,
    name: 'Gaming Mouse',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
    category: 'Accessories',
  },
  {
    id: 6,
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&q=80',
    category: 'Accessories',
  },
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState<'login' | 'signup' | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (type: 'login' | 'signup') => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Authentication is not configured. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = type === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      setShowAuth(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background text-gray-100">
      {/* Navigation */}
      <nav className="bg-background-lighter p-4 fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-primary"
          >
            TechStore
          </motion.h1>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#" className="hover:text-primary transition-colors">Products</a>
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-primary transition-colors">
              <Search size={24} />
            </button>
            <button className="p-2 hover:text-primary transition-colors">
              <ShoppingCart size={24} />
            </button>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 hover:text-primary transition-colors"
              >
                <User size={24} />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuth('login')}
                className="flex items-center space-x-2 hover:text-primary transition-colors"
              >
                <User size={24} />
                <span className="hidden md:inline">Sign In</span>
              </button>
            )}
            <button 
              className="md:hidden p-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 w-full bg-background-lighter p-4 md:hidden z-40"
          >
            <div className="flex flex-col space-y-4">
              <a href="#" className="hover:text-primary transition-colors">Home</a>
              <a href="#" className="hover:text-primary transition-colors">Products</a>
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-lighter p-8 rounded-lg max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-6">
                {showAuth === 'login' ? 'Sign In' : 'Sign Up'}
              </h2>
              {error && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAuth(showAuth);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded bg-background border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded bg-background border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : showAuth === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAuth(showAuth === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  {showAuth === 'login'
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Sign In'}
                </button>
              </div>
              <button
                onClick={() => setShowAuth(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-24 pb-12 px-4"
      >
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Discover Amazing Tech
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-8"
          >
            Experience the future with our premium collection
          </motion.p>
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full transition-colors"
          >
            Shop Now
          </motion.button>
        </div>
      </motion.section>

      {/* Categories */}
      <section className="py-12 px-4 bg-background-lighter">
        <div className="container mx-auto">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-8"
          >
            Shop by Category
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Audio', 'Wearables', 'Accessories', 'All Products'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-6 rounded-lg text-center cursor-pointer hover:bg-primary hover:text-white transition-all duration-300"
              >
                <h4 className="font-semibold">{category}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-8">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-background-lighter rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden group">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-semibold">{product.name}</h4>
                    <span className="text-sm text-primary">{product.category}</span>
                  </div>
                  <p className="text-gray-400 mb-4">${product.price}</p>
                  <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded transition-colors">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;