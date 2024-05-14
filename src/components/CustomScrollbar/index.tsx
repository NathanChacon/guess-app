import { ReactNode } from "react";
import Scrollbars from "react-custom-scrollbars-2";

interface Props {
  children: ReactNode;
  scrollRef?: any;
  // any props that come into the component
}

const CustomScrollbar = ({ children, scrollRef }: Props) => {
  return (
    <Scrollbars style={{ width: "100%", height: "100%" }} ref={scrollRef}>
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbar;
