/* const AddressAutocomplete = ({ label, name, value, onChange, error, onBlur, type, ref, id }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error: string, onBlur: (e: React.FocusEvent<HTMLInputElement>) => void, type: string, ref?: React.RefObject<HTMLInputElement>, id: string }) => {     
    return (
      <div className="relative w-full max-w-md mb-8">
        <input  autoComplete="on" ref={ref} type={type} id={id} value={value} name={name} className="block w-full p-2 text-sm text-gray-900 rounded-3xl border border-gray-300 focus:border-purple-400 peer focus:ring-1 focus:ring-purple-400 focus:outline-none" placeholder=" " required onChange={onChange} onBlur={onBlur} />  
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
 const onChangeRef = useRef(onChange);
 const [hasSelectedFromGoogle, setHasSelectedFromGoogle] = React.useState(false);
 const { hasError, getFieldError } = useValidation();
 const hasFieldError = hasError(name);
 const fieldError = getFieldError(name);
 
 useEffect(() => {
  onSelectRef.current = onSelect;
  onChangeRef.current = onChange;
 }, [onSelect, onChange]);

 // Reset flag if value becomes empty
 useEffect(() => {
  if (!value && hasSelectedFromGoogle) {
    setHasSelectedFromGoogle(false);
  }
 }, [value, hasSelectedFromGoogle]);


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
  
      // Dès que l'utilisateur choisit un lieu
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.address_components) return;
  
        let streetNumber = "",
          route = "",
          city = "",
          state = "",
          zipCode = "",
          country = "";
        
        // Parse address components by type instead of fixed indices
        place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
          const types = component.types;
          
          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          }
          if (types.includes("route")) {
            route = component.long_name;
          }
          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.short_name;
          }
          if (types.includes("country")) {
            country = component.long_name;
          }
          if (types.includes("postal_code")) {
            zipCode = component.long_name;
          }
        });
        
      const formatted = `${streetNumber} ${route}, ${city}, ${state}, ${zipCode}, ${country}`;
      
      // Mark that user selected from Google dropdown
      setHasSelectedFromGoogle(true);
      
      // Update the input value visually and trigger onChange to sync with parent state
      if (inputRef.current) {
        inputRef.current.value = formatted;
        
        // Create a synthetic event to trigger onChange
        const syntheticEvent = {
          target: inputRef.current,
          currentTarget: inputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChangeRef.current(syntheticEvent);
      }
      
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
  
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset flag when user types manually
    if (hasSelectedFromGoogle) {
      setHasSelectedFromGoogle(false);
    }
    onChange(e);
  };
  
  return <div className="w-full mb-4">
    <label className="text-xs text-gray-500 px-2 top-2 start-1">
      {label}
    </label>
    <div className="relative">
      <input 
        autoComplete="on" 
        ref={inputRef} 
        type={type} 
        id={id} 
        value={value} 
        name={name} 
        className={`block w-full p-2 text-sm text-gray-900 rounded-3xl border focus:ring-1 focus:ring-purple-400 focus:outline-none ${
          hasSelectedFromGoogle 
            ? 'border-green-400 focus:border-green-500' 
            : 'border-gray-300 focus:border-purple-400'
        }`}
        placeholder=" "  
        onChange={handleManualChange} 
        onBlur={onBlur} 
      />
      {hasSelectedFromGoogle && value && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500" title="Address validated by Google">
          ✓
        </span>
      )}
    </div>
    {!hasSelectedFromGoogle && value && value.length > 3 && (
      <p className="mt-1 text-xs text-amber-600 px-2">
        💡 Please select an address from the dropdown suggestions to validate the address
      </p>
    )}
    {hasFieldError && (
        <p className="mt-1 text-sm text-red-600 px-2">{fieldError}</p>
      )}  
  </div>    
};
