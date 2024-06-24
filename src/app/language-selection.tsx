import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {  useLanguageContext } from "@/context/language-context";
import { Link } from "react-router-dom";

function LanguageSelectionComponent() {
  const { language, setLanguage } = useLanguageContext();

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div>
      <h2>Current Language: {language}</h2>

      <RadioGroup
        value={language}
        className="grid grid-cols-2 gap-4"
        onValueChange={(value) => {
          changeLanguage(value);
        }}
      >
        <div>
          <RadioGroupItem
            value="hindi"
            id="hindi"
            className="peer sr-only"
          />
          <Label
            htmlFor="hindi"
            className="flex items-center justify-start text-[#60646C] bg-accent/60 rounded-md border-2 border-muted px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary"
          >
            Hindi
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="english"
            id="english"
            className="peer sr-only"
          />
          <Label
            htmlFor="english"
            className="flex items-center justify-start text-[#60646C] bg-accent/60 rounded-md border-2 border-muted px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary"
          >
            English
          </Label>
        </div>
        <Link to={"/users"}><Button variant={'secondary'}>Proceed</Button></Link>
      </RadioGroup>
    </div>
  );
}

export default LanguageSelectionComponent;
