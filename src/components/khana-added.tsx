
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessDialog({ isOpen, onClose }: SuccessDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500 delay-100">
            <CheckCircle className="w-8 h-8 text-green-500 animate-in zoom-in-50 duration-300 delay-300" />
          </div>

          {/* Success Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom-2 duration-300 delay-200">
            Khana Added Successfully!
          </h3>
          <p className="text-gray-600 mb-6 animate-in slide-in-from-bottom-2 duration-300 delay-300">
            Your delicious dish has been added to the menu.
          </p>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-600 transition-all duration-200 transform hover:scale-105 animate-in slide-in-from-bottom-2  delay-400"
          >
            Great!
          </Button>
        </div>
      </div>
    </div>
  )
}
