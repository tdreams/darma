import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
export default function NotifyMe() {
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    //Simulation from submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert(
      "Thank you four your interest! We'll notify you when Darma is available in your area."
    );
    setEmail("");
    setZipCode("");
  };
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Informed</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Be the first to know when Darma is available in your area. Sign up
            for notifications and never miss an update!
          </p>
        </motion.div>
        <div className="max-w-md mx-auto">
          <Card className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Get Notified</CardTitle>
              <CardDescription>
                Enter your details to receive updates about Re-turnz
                availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="12345"
                      className="pl-10"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Notify Me"}
                  <Bell className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
