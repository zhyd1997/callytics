import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink, MessageSquare, Video } from "lucide-react"

export const ReferralSection = () => {
  {/* Cal.com Referral Section */}
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
      <div className="text-center max-w-4xl mx-auto">
        <h3 className="text-2xl mb-4">Looking for a Scheduling Solution?</h3>
        <p className="text-muted-foreground mb-6">
          I use and recommend Cal.com for all my scheduling needs. It's open-source, 
          privacy-focused, and incredibly flexible for any business.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Video className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold mb-2">Video Conferencing</h4>
            <p className="text-sm text-muted-foreground">
              Seamless integration with Zoom, Google Meet, and more
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold mb-2">Smart Scheduling</h4>
            <p className="text-sm text-muted-foreground">
              AI-powered availability and automatic time zone detection
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold mb-2">Full Customization</h4>
            <p className="text-sm text-muted-foreground">
              Brand your booking pages and workflows completely
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a 
              href="https://cal.link/refer-cal-com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Try Cal.com Free
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a 
              href="https://github.com/calcom/cal.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          * Using my referral link helps support my work and gets you started with Cal.com's powerful features
        </p>
      </div>
    </div>
  )
}