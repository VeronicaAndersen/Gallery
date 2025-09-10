import { JSX } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Loader() {
  return (
    <span className="spin">
      {AiOutlineLoading3Quarters({ size: 24 }) as JSX.Element}
    </span>
  );
}
