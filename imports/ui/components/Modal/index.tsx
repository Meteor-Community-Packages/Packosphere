import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { X } from 'heroicons-react';

interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: (event: React.MouseEvent, currentTarget: HTMLDivElement | null) => void
}

export default ({ isOpen, children, onClose }: ModalProps): JSX.Element => {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const overlay = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current = document.getElementById('portal');
    setMounted(true);
  }, []);

  return mounted && ref.current !== null
    ? ReactDom.createPortal(
      <div ref={overlay} onClick={(e) => onClose(e, overlay.current as HTMLDivElement)} className={`inset-0 overflow-hidden bg-blueGray-900 bg-opacity-60 z-10 ${isOpen ? 'fixed' : 'hidden'}`}>
        <div className="px-5 sm:px-0 fixed top-32 z-10 mx-auto max-w-lg inset-x-0">
          <div className="relative text-gray-200 bg-blueGray-700 py-6 px-8 rounded-lg  bg-opacity-90 ">
            <button onClick={(e) => onClose(e, null)} className="absolute flex items-center justify-center w-8 h-8 rounded-full top-5 right-5 text-gray-200 hover:bg-blueGray-800 active:bg-gray-800">
              <X size={18} />
            </button>
            <div className="space-y-4">
              {children}
            </div>
          </div>
        </div>
      </div>
      ,
      ref.current,
    )
    : <></>;
};
