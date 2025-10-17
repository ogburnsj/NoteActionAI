import { Button } from "@/components/ui/button";
import { Dumbbell, TrendingUp, UtensilsCrossed, Heart, Calculator } from "lucide-react";
import heroImage from "@assets/generated_images/Fitness_app_hero_illustration_ca10ef40.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">FitTrack</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">
                Your Complete
                <br />
                <span className="text-primary">Fitness Companion</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Track workouts, calculate weight plates, monitor nutrition, and connect your heart rate monitor - all in one powerful app.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild data-testid="button-get-started">
                  <a href="/api/login">Get Started</a>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-learn-more">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Fitness Tracking"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">Powerful features to track your fitness journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Workout Tracking</h3>
              <p className="text-muted-foreground">
                Log exercises, sets, reps, and weights. Track your progress over time with detailed analytics.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Plate Calculator</h3>
              <p className="text-muted-foreground">
                Automatically calculate which plates to load on your barbell for any target weight.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nutrition Tracking</h3>
              <p className="text-muted-foreground">
                Log meals with macros, scan barcodes for instant nutrition data, and hit your daily goals.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Heart Rate Monitoring</h3>
              <p className="text-muted-foreground">
                Connect Bluetooth heart rate monitors and track your cardio zones in real-time.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Charts</h3>
              <p className="text-muted-foreground">
                Visualize your strength gains and nutrition trends with beautiful, interactive charts.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Settings</h3>
              <p className="text-muted-foreground">
                Set your units (lb/kg), available plates, calorie goals, and macro targets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of athletes tracking their progress with FitTrack
          </p>
          <Button size="lg" asChild data-testid="button-start-tracking">
            <a href="/api/login">Start Tracking Free</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
