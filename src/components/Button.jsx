import { btn } from "../constants/style";

export default function Button({ className = btn, style, children, ...props }) {
  return (
    <button className={`${className} ${style}`} {...props}>
      {children}
    </button>
  );
}
