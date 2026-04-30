'use client';
import { useState } from 'react';
import Swal from 'sweetalert2';

const CUISINES = [
  'Cakes N Pastries',
  'Fast Food',
  'Desserts',
  'Italian',
  'North Indian',
  'Sweets',
  'Sandwiches',
  'Chinese',
  'Pizza',
  'Wraps',
];

export default function AdminPage() {
  const [step, setStep] = useState(1);

  /* STEP 1 */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [phone, setPhone] = useState('');

  /* STEP 2 */
  const [restaurantTypes, setRestaurantTypes] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [currency] = useState('INR');

  /* STEP 3 */
  const [restaurantName, setRestaurantName] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [pincode, setPincode] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [promo, setPromo] = useState('');
  const [timezone, setTimezone] = useState('');

  /* UI helpers */
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  /* VALIDATION HELPERS */
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidMobile = (mobile: string) =>
    /^[0-9]{10}$/.test(mobile);

  /* STEP LOGIC */
  const toggleType = (type: string) => {
    setRestaurantTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const addCuisine = (c: string) => {
    if (!cuisines.includes(c)) setCuisines([...cuisines, c]);
    setQuery('');
    setOpen(false);
  };

  const removeCuisine = (c: string) =>
    setCuisines(cuisines.filter((x) => x !== c));

  const filteredCuisines = CUISINES.filter(
    (c) =>
      c.toLowerCase().includes(query.toLowerCase()) &&
      !cuisines.includes(c)
  );

  /* STEP 1 VALIDATION */
  const goToStep2 = () => {
    if (!firstName || !lastName || !email || !mobile) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill all required fields.',
      });
      return false;
    }

    if (!isValidEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return false;
    }

    if (!isValidMobile(mobile)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Mobile Number',
        text: 'Mobile number must be 10 digits.',
      });
      return false;
    }

    setStep(2);
    return true;
  };

  /* STEP 2 VALIDATION */
  const goToStep3 = () => {
    if (restaurantTypes.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Restaurant Type Required',
        text: 'Please select at least one restaurant type.',
      });
      return false;
    }

    if (cuisines.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cuisine Required',
        text: 'Please select at least one cuisine.',
      });
      return false;
    }

    setStep(3);
    return true;
  };

  /* 🔥 CLICKABLE STEPPER LOGIC */
  const goToStep = (targetStep: number) => {
    if (targetStep === step) return;

    // Always allow going backward
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }

    // Step 1 → Step 2
    if (targetStep === 2) {
      goToStep2();
      return;
    }

    // Step 1/2 → Step 3
    if (targetStep === 3) {
      if (step === 1) {
        const ok = goToStep2();
        if (ok) goToStep3();
      } else {
        goToStep3();
      }
    }
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (
      !restaurantName ||
      !address1 ||
      !area ||
      !city ||
      !state ||
      !country ||
      !website
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill all required restaurant details.',
      });
      return;
    }

    const payload = {
      shop_id: 0,
      first_name: firstName,
      last_name: lastName,
      email_id: email,
      mobileno: mobile,
      phoneno: phone,
      restaurant_types: restaurantTypes,
      default_currency: currency,
      cuisines,
      restaurant_name: restaurantName,
      apartment_no: apartmentNo,
      pincode,
      address_line_1: address1,
      address_line_2: address2,
      area,
      city,
      state,
      country,
      website_url: website,
      promocode: promo,
      timezone,
      latitude: 0,
      longitude: 0,
      payment_method: '',
      delivery_fees: 0,
      min_order: 0,
      delivery_time: '',
    };

    try {
      const res = await fetch(
        'https://localhost:44376/api/MyProfile/create',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Admin profile created successfully!',
        confirmButtonColor: '#14b8a6',
      });

      setStep(1);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header">
        <button
          className="back-btn"
          disabled={step === 1}
          onClick={() => step > 1 && setStep(step - 1)}
        >
          ← BACK
        </button>
        <button className="help-btn">HELP</button>
      </div>

      {/* ✅ FUNCTIONAL STEPPER */}
      <div className="stepper-wrapper">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`step-box ${
              step === n ? 'active' : step > n ? 'completed' : ''
            }`}
            onClick={() => goToStep(n)}
            style={{ cursor: 'pointer' }}
          >
            {n}
          </div>
        ))}
      </div>

      <div className="card">
        {/* STEP CONTENT — unchanged UI */}
        {/* Your existing JSX for steps 1, 2, 3 stays exactly the same */}
        {step === 1 && (
          <>
            <h2 className="card-title">Owner Information</h2>
            <div className="form-grid">
              <div className="form-group"><label>First Name *</label><input value={firstName} onChange={(e)=>setFirstName(e.target.value)} /></div>
              <div className="form-group"><label>Last Name *</label><input value={lastName} onChange={(e)=>setLastName(e.target.value)} /></div>
              <div className="form-group"><label>Email Address *</label><input value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              <div className="form-group"><label>Mobile No *</label><input value={mobile} onChange={(e)=>setMobile(e.target.value)} /></div>
              <div className="form-group"><label>Restaurant Phone No</label><input value={phone} onChange={(e)=>setPhone(e.target.value)} /></div>
            </div>
            <button className="primary-btn" onClick={goToStep2}>NEXT</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="card-title">Other Information</h2>
            <div className="two-column">
              <div>
                <label>Restaurant Type *</label>
                <div className="checkbox-grid">
                  {['Vegetarian','Non vegetarian','Jain','Vegan','Eggitarian','Gluten-Free','Halal','Organic','Ayurvedic']
                    .map((t) => (
                      <label key={t}>
                        <input type="checkbox" checked={restaurantTypes.includes(t)} onChange={() => toggleType(t)} />
                        {t}
                      </label>
                  ))}
                </div>
              </div>

              <div>
                <label>Select Your Restaurant Cuisines *</label>
                <div className="select-box">
                  <div className="chips-input">
                    {cuisines.map((c) => (
                      <span key={c} className="chip">
                        {c}
                        <button className="chip-remove" onClick={() => removeCuisine(c)}>×</button>
                      </span>
                    ))}
                    <input value={query} onChange={(e)=>{setQuery(e.target.value); setOpen(true);}} />
                  </div>

                  {open && (
                    <div className="dropdown">
                      {filteredCuisines.map((c) => (
                        <div key={c} className="dropdown-item" onClick={() => addCuisine(c)}>
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="currency">
              <label>Default Currency *</label>
              <input value="INR" disabled />
            </div>

            <button className="primary-btn" onClick={goToStep3}>NEXT</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="card-title">Restaurant Information</h2>
            <div className="form-grid">
              <div className="form-group"><label>Restaurant Name *</label><input onChange={(e)=>setRestaurantName(e.target.value)} /></div>
              <div className="form-group"><label>Apartment / House No *</label><input onChange={(e)=>setApartmentNo(e.target.value)} /></div>
              <div className="form-group"><label>Pincode</label><input onChange={(e)=>setPincode(e.target.value)} /></div>
              <div className="form-group"><label>Address Line 1 *</label><input onChange={(e)=>setAddress1(e.target.value)} /></div>
              <div className="form-group"><label>Address Line 2</label><input onChange={(e)=>setAddress2(e.target.value)} /></div>
              <div className="form-group"><label>Area *</label><input onChange={(e)=>setArea(e.target.value)} /></div>
              <div className="form-group"><label>City *</label><input onChange={(e)=>setCity(e.target.value)} /></div>
              <div className="form-group"><label>State *</label><input onChange={(e)=>setState(e.target.value)} /></div>
              <div className="form-group"><label>Country *</label><input onChange={(e)=>setCountry(e.target.value)} /></div>
              <div className="form-group"><label>Website URL *</label><input onChange={(e)=>setWebsite(e.target.value)} /></div>
              <div className="form-group"><label>Promocode</label><input onChange={(e)=>setPromo(e.target.value)} /></div>
              <div className="form-group"><label>Timezone *</label><input onChange={(e)=>setTimezone(e.target.value)} /></div>
            </div>

            <button className="primary-btn" onClick={handleSubmit}>SUBMIT</button>
          </>
        )}
      </div>
    </div>
    
  );
}