import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CopyButton({ value }: {value: string}) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value)

        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 3000);
    }

    return (
        <Button
            type="button"
            size="icon"
            onClick={handleCopy}
            className="h-7 w-7 cursor-pointer bg-transparent text-chateau-green-500 hover:bg-transparent"
        >
            {copied ? (
                <Check className="h-4 w-4" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    )
}