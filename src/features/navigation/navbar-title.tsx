import {  BoxIcon } from "lucide-react";

function NavbarTitle() {
    return (
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <BoxIcon size={20} />
              </div>
              <span>awsm-http</span>
            </div>
          </div>
    );
}

export default NavbarTitle;