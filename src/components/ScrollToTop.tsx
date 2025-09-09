import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleScrollToTop}
      className="w-full"
    >
      <ArrowUp className="h-4 w-4 mr-2" />
      Back to top
    </Button>
  );
};

export { ScrollToTop };