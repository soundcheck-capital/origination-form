import React, { useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useValidation } from "../../contexts/ValidationContext";

const libraries: ("places")[] = ["places"];

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.trim() ?? '';

export type AddressAutocompleteProps = {
  label: string;
  name: string;
  value: string;
  onSelect: (address: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  type: string;
  ref?: React.RefObject<HTMLInputElement>;
  id: string;
  required?: boolean;
};

const AddressFieldShell: React.FC<{
  label: string;
  name: string;
  fieldError: string | null;
  hasFieldError: boolean;
  children: React.ReactNode;
}> = ({ label, name, fieldError, hasFieldError, children }) => (
  <div className="w-full mb-4">
    <label htmlFor={name} className="text-xs text-gray-500 px-2 top-2 start-1">
      {label}
    </label>
    <div className="relative">{children}</div>
    {hasFieldError && fieldError && (
      <p className="mt-1 text-sm text-red-600 px-2">{fieldError}</p>
    )}
  </div>
);

/** Plain text input when Maps API key is absent (CI, local without .env). */
const AddressPlainInput: React.FC<AddressAutocompleteProps> = ({
  label,
  name,
  value,
  onSelect,
  onChange,
  onBlur,
  type,
  id,
}) => {
  const { hasError, getFieldError } = useValidation();
  const hasFieldError = hasError(name);
  const fieldError = getFieldError(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    onSelect(e.target.value);
  };

  return (
    <AddressFieldShell
      label={label}
      name={name}
      fieldError={fieldError}
      hasFieldError={hasFieldError}
    >
      <input
        autoComplete="street-address"
        type={type || "text"}
        id={id || name}
        name={name}
        value={value}
        className="block w-full p-2 text-sm text-gray-900 rounded-3xl border border-gray-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none"
        placeholder=" "
        onChange={handleChange}
        onBlur={onBlur}
      />
    </AddressFieldShell>
  );
};

const AddressGoogleInput: React.FC<AddressAutocompleteProps> = ({
  label,
  name,
  value,
  onSelect,
  onChange,
  onBlur,
  type,
  id,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
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

  useEffect(() => {
    if (!value && hasSelectedFromGoogle) {
      setHasSelectedFromGoogle(false);
    }
  }, [value, hasSelectedFromGoogle]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "US" },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let streetNumber = "";
      let route = "";
      let city = "";
      let state = "";
      let zipCode = "";
      let country = "";

      place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
        const types = component.types;
        if (types.includes("street_number")) streetNumber = component.long_name;
        if (types.includes("route")) route = component.long_name;
        if (types.includes("locality")) city = component.long_name;
        if (types.includes("administrative_area_level_1")) state = component.short_name;
        if (types.includes("country")) country = component.long_name;
        if (types.includes("postal_code")) zipCode = component.long_name;
      });

      const formatted = `${streetNumber} ${route}, ${city}, ${state}, ${zipCode}, ${country}`;
      setHasSelectedFromGoogle(true);

      if (inputRef.current) {
        inputRef.current.value = formatted;
        const syntheticEvent = {
          target: inputRef.current,
          currentTarget: inputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChangeRef.current(syntheticEvent);
      }

      onSelectRef.current(formatted);
    });

    return () => {
      window.google.maps.event.clearListeners(autocomplete);
    };
  }, [isLoaded]);

  if (loadError) {
    return <AddressPlainInput label={label} name={name} value={value} onSelect={onSelect} onChange={onChange} error="" onBlur={onBlur} type={type} id={id} />;
  }

  if (!isLoaded) {
    return <div className="w-full mb-4 text-sm text-gray-500 px-2">Loading address search…</div>;
  }

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasSelectedFromGoogle) {
      setHasSelectedFromGoogle(false);
    }
    onChange(e);
  };

  return (
    <AddressFieldShell
      label={label}
      name={name}
      fieldError={fieldError}
      hasFieldError={hasFieldError}
    >
      <input
        autoComplete="on"
        ref={inputRef}
        type={type}
        id={id}
        value={value}
        name={name}
        className={`block w-full p-2 text-sm text-gray-900 rounded-3xl border focus:ring-1 focus:ring-purple-400 focus:outline-none ${
          hasSelectedFromGoogle
            ? "border-green-400 focus:border-green-500"
            : "border-gray-300 focus:border-purple-400"
        }`}
        placeholder=" "
        onChange={handleManualChange}
        onBlur={onBlur}
      />
      {hasSelectedFromGoogle && value && (
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
          title="Address validated by Google"
        >
          ✓
        </span>
      )}
      {!hasSelectedFromGoogle && value && value.length > 3 && (
        <p className="mt-1 text-xs text-amber-600 px-2">
          Please select an address from the dropdown suggestions to validate the address
        </p>
      )}
    </AddressFieldShell>
  );
};

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = (props) => {
  if (!googleMapsApiKey) {
    return <AddressPlainInput {...props} />;
  }
  return <AddressGoogleInput {...props} />;
};
