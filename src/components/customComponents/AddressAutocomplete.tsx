/* const AddressAutocomplete = ({ label, name, value, onChange, error, onBlur, type, ref, id }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error: string, onBlur: (e: React.FocusEvent<HTMLInputElement>) => void, type: string, ref?: React.RefObject<HTMLInputElement>, id: string }) => {     
    return (
      <div className="relative w-full max-w-md mb-8">
        <input  autoComplete="on" ref={ref} type={type} id={id} value={value} name={name} className="block w-full p-2 text-sm text-gray-900 rounded-xl border border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-amber-500 focus:outline-none" placeholder=" " required onChange={onChange} onBlur={onBlur} />  
        <label htmlFor={id} className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-8 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{label}</label>
      </div>
    );
  };  
  
  export default AddressAutocomplete; */

// MyAddressInput.tsx
import React, { useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useValidation } from "../../contexts/ValidationContext";

const libraries: ("places")[] = ["places"];

export const AddressAutocomplete: React.FC<{ label: string, name: string, value: string, onSelect: any, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error: string, onBlur: (e: React.FocusEvent<HTMLInputElement>) => void, type: string, ref?: React.RefObject<HTMLInputElement>, id: string, required?: boolean }> = ({ label, name, value, onSelect, onChange, error = '', onBlur, type, ref, id, required = false }) => {
  //const dispatch = useDispatch();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyA7_2peM-CW7KqJzdHEAmL2PYK-DEnjX0A",
    libraries,
  });
  const inputRef = useRef<HTMLInputElement>(null);
 const onSelectRef = useRef(onSelect);
 const { hasError, getFieldError } = useValidation();
 const hasFieldError = hasError(name);
 const fieldError = getFieldError(name);
 useEffect(() => {
  onSelectRef.current = onSelect;
 }, [onSelect]);


  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "US" },
          fields: ["address_components", "formatted_address", "geometry"],
          types: ["address"],
        }
      );
  
      // Dès que l’utilisateur choisit un lieu
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.address_components) return;
  
        let streetNumber = "",
          route = "",
          city = "",
          state = "",
          zipCode = "",
          country = "";
          streetNumber = place.address_components[0].long_name;
          route = place.address_components[1].long_name;
          city = place.address_components[2].long_name;
          state = place.address_components[5].short_name;
          country = place.address_components[6].long_name;
          zipCode = place.address_components[7].long_name;
      const formatted = `${streetNumber} ${route}, ${city}, ${state}, ${zipCode}, ${country}`;
      onSelectRef.current(formatted);
      });
      return () => {
        // important : on enlève le listener pour éviter les doublons
        window.google.maps.event.clearListeners(autocomplete);
      };
  }, [isLoaded]);

  if (loadError) return <div>Erreur de chargement Google Maps</div>;
  if (!isLoaded) return <div>Chargement...</div>;

  //return <input ref={inputRef} placeholder="Adresse US" />;
  return <div className="w-full mb-4">
    <label className="text-xs text-gray-500 px-2 top-2 start-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input autoComplete="on" ref={inputRef} type={type} id={id} value={value} name={name} className="block w-full p-2 text-sm text-gray-900 rounded-xl border border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-amber-500 focus:outline-none" placeholder=" "  onChange={onChange} onBlur={onBlur} />
    {hasFieldError && (
        <p className="mt-1 text-sm text-red-600 px-2">{fieldError}</p>
      )}  </div>    
};
