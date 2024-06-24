import { Link, useOutlet } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import MenuIcon from "../icons/menu";
import RefreshIcon from "../icons/refresh";
import { MenuItems } from "@/routes/menu-items";
import { useState } from "react";
import { useLanguageContext } from "@/context/language-context";
import { translations } from "@/translation";

// The layout component for dashboard-related pages.
const DashboardLayout = () => {
  const outlet = useOutlet();
  const [open, setOpen] = useState(false);
  const {language} = useLanguageContext()

  return (
    <>
      <div className="bg-[#a7ebfa] flex items-center justify-start p-5">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="mr-5">
            <Button variant="outline" className="h-10 w-10 p-0">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <>
              <SheetHeader>
                <SheetTitle>Menu Items</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 pt-4">
                {MenuItems.map((menu) => {
                  return (
                    <Link
                      to={menu.link}
                      key={menu.title}
                      onClick={() => setOpen(false)}
                      className="w-full"
                    >
                      <Button variant={"outline"} className="w-full">
                        {menu.title}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </>
            <SheetFooter className="mt-auto">
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>{" "}
        <h1 className="text-xl font-medium">{translations[language].applicationName}</h1>
        <Button
          variant="outline"
          className="h-10 w-10 p-0 ml-auto"
          onClick={() => {
            window.location.reload();
          }}
        >
          <RefreshIcon />
        </Button>
      </div>
      <div className="h-[calc(100vh-100px)] mt-5 p-5">{outlet}</div>
    </>
  );
};

export default DashboardLayout;
