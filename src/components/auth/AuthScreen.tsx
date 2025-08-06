// Authentication Screen Component
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ListTodo, Smartphone, Zap } from 'lucide-react';

interface AuthScreenProps {
  onSignIn: () => Promise<void>;
  isLoading: boolean;
}

export function AuthScreen({ onSignIn, isLoading }: AuthScreenProps) {
  const features = [
    {
      icon: ListTodo,
      title: 'Smart Task Management',
      description: 'Create, organize, and track your tasks with intuitive controls'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Perfect experience on any device with touch-friendly gestures'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Smooth animations and instant sync across all your devices'
    },
    {
      icon: CheckCircle,
      title: 'Stay Productive',
      description: 'Focus on what matters with smart filters and notifications'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <ListTodo className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              FlowTask
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            by Katomaran - Your Personal Task Management Solution
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold mb-4 text-balance">
                Organize Your Life,
                <span className="gradient-primary bg-clip-text text-transparent">
                  {' '}One Task at a Time
                </span>
              </h2>
              <p className="text-xl text-muted-foreground text-balance">
                The most intuitive way to manage your daily tasks with beautiful 
                animations and seamless mobile experience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-md shadow-[var(--shadow-elevated)] border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription className="text-base">
                  Sign in with Google to sync your tasks across all devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  onClick={onSignIn}
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Demo mode available - try without signing in
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            Built for Katomaran Hackathon • React + Capacitor + TypeScript
          </p>
        </motion.div>
      </div>
    </div>
  );
}