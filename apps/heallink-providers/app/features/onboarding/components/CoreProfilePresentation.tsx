"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  Plus, 
  Trash2,
  Building,
  Phone,
  Mail,
  Calendar,
  CreditCard as IdCard,
  Shield
} from "lucide-react";
import { InputField, SelectField, FileUpload, ToggleField } from "./FormComponents";
import { LegalIdentity, ContactLocation, PayoutTax } from "../types";

interface CoreProfilePresentationProps {
  legalIdentity: Partial<LegalIdentity>;
  contactLocations: ContactLocation[];
  payoutTax: Partial<PayoutTax>;
  onLegalIdentityChange: (data: Partial<LegalIdentity>) => void;
  onContactLocationChange: (index: number, data: Partial<ContactLocation>) => void;
  onAddContactLocation: () => void;
  onRemoveContactLocation: (index: number) => void;
  onPayoutTaxChange: (data: Partial<PayoutTax>) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
  errors: any;
}

export default function CoreProfilePresentation({
  legalIdentity,
  contactLocations,
  payoutTax,
  onLegalIdentityChange,
  onContactLocationChange,
  onAddContactLocation,
  onRemoveContactLocation,
  onPayoutTaxChange,
  onContinue,
  onBack,
  isLoading,
  errors,
}: CoreProfilePresentationProps) {
  const [activeSection, setActiveSection] = useState<'legal' | 'contact' | 'payout'>('legal');

  const sections = [
    { id: 'legal', name: 'Legal Identity', icon: User, description: 'Personal information and identification' },
    { id: 'contact', name: 'Contact & Practice', icon: MapPin, description: 'Locations and contact information' },
    { id: 'payout', name: 'Payout & Tax', icon: CreditCard, description: 'Banking and tax information' },
  ];

  const idTypes = [
    { value: 'ssn', label: 'Social Security Number' },
    { value: 'passport', label: 'Passport' },
    { value: 'driver-license', label: 'Driver License' },
    { value: 'ein', label: 'Employer Identification Number' },
  ];

  const accountTypes = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
  ];

  const taxIdTypes = [
    { value: 'ssn', label: 'Social Security Number' },
    { value: 'ein', label: 'Employer Identification Number' },
  ];

  const stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    // Add more states as needed
  ];

  return (
    <div className="space-y-8">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-4 justify-center">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isCompleted = index < sections.findIndex(s => s.id === activeSection);
          
          return (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-xl transition-all
                ${isActive 
                  ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg" 
                  : isCompleted
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800"
                    : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-heart/30 shadow-sm"
                }
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${isActive 
                  ? "bg-white/20" 
                  : isCompleted 
                    ? "bg-green-100 dark:bg-green-800" 
                    : "bg-gray-100 dark:bg-gray-800"
                }
              `}>
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : isCompleted ? "text-green-600" : "text-gray-600"}`} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">{section.name}</h3>
                <p className={`text-xs ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                  {section.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Section Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Legal Identity Section */}
        {activeSection === 'legal' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Legal Identity</h2>
              <p className="text-muted-foreground">
                Provide your legal name and government identification for verification
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstName"
                value={legalIdentity.firstName || ""}
                onChange={(value) => onLegalIdentityChange({ ...legalIdentity, firstName: value })}
                placeholder="Enter your first name"
                required
                icon={<User className="w-4 h-4" />}
                error={errors?.firstName}
              />

              <InputField
                label="Middle Name"
                name="middleName"
                value={legalIdentity.middleName || ""}
                onChange={(value) => onLegalIdentityChange({ ...legalIdentity, middleName: value })}
                placeholder="Enter your middle name (optional)"
                icon={<User className="w-4 h-4" />}
              />

              <InputField
                label="Last Name"
                name="lastName"
                value={legalIdentity.lastName || ""}
                onChange={(value) => onLegalIdentityChange({ ...legalIdentity, lastName: value })}
                placeholder="Enter your last name"
                required
                icon={<User className="w-4 h-4" />}
                error={errors?.lastName}
              />

              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={legalIdentity.dateOfBirth || ""}
                onChange={(value) => onLegalIdentityChange({ ...legalIdentity, dateOfBirth: value })}
                required
                icon={<Calendar className="w-4 h-4" />}
                error={errors?.dateOfBirth}
              />
            </div>

            <div className="space-y-6 p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <IdCard className="w-5 h-5" />
                Government Identification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="ID Type"
                  name="idType"
                  value={legalIdentity.governmentId?.type || ""}
                  onChange={(value) => onLegalIdentityChange({
                    ...legalIdentity,
                    governmentId: { ...legalIdentity.governmentId, type: value as any }
                  })}
                  options={idTypes}
                  required
                  icon={<Shield className="w-4 h-4" />}
                />

                <InputField
                  label="ID Number"
                  name="idNumber"
                  value={legalIdentity.governmentId?.number || ""}
                  onChange={(value) => onLegalIdentityChange({
                    ...legalIdentity,
                    governmentId: { ...legalIdentity.governmentId, number: value }
                  })}
                  placeholder="Enter your ID number"
                  required
                  mask={legalIdentity.governmentId?.type === 'ssn' ? 'ssn' : legalIdentity.governmentId?.type === 'ein' ? 'ein' : undefined}
                  icon={<IdCard className="w-4 h-4" />}
                />
              </div>

              <FileUpload
                label="Upload ID Document"
                name="idDocument"
                value={legalIdentity.governmentId?.uploadedDocument}
                onChange={(file) => onLegalIdentityChange({
                  ...legalIdentity,
                  governmentId: { ...legalIdentity.governmentId, uploadedDocument: file }
                })}
                accept=".pdf,.jpg,.jpeg,.png"
                description="Upload a clear photo or scan of your government ID"
                icon={<FileText className="w-4 h-4" />}
                required
              />
            </div>
          </div>
        )}

        {/* Contact & Practice Locations Section */}
        {activeSection === 'contact' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Contact & Practice Locations</h2>
              <p className="text-muted-foreground">
                Add your practice locations and contact information
              </p>
            </div>

            {contactLocations.map((location, index) => (
              <motion.div
                key={location.id}
                className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {location.type === 'primary' ? 'Primary Location' : `Additional Location ${index}`}
                  </h3>
                  {location.type !== 'primary' && (
                    <button
                      onClick={() => onRemoveContactLocation(index)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>

                <ToggleField
                  label="Telehealth Only Location"
                  name={`telehealth-${index}`}
                  value={location.isTelehealthOnly}
                  onChange={(value) => onContactLocationChange(index, { ...location, isTelehealthOnly: value })}
                  description="Check this if this is a virtual/telehealth only practice location"
                />

                {!location.isTelehealthOnly && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <InputField
                        label="Street Address"
                        name={`street-${index}`}
                        value={location.address?.street || ""}
                        onChange={(value) => onContactLocationChange(index, {
                          ...location,
                          address: { ...location.address, street: value }
                        })}
                        placeholder="Enter street address"
                        required
                        icon={<MapPin className="w-4 h-4" />}
                      />
                    </div>

                    <InputField
                      label="City"
                      name={`city-${index}`}
                      value={location.address?.city || ""}
                      onChange={(value) => onContactLocationChange(index, {
                        ...location,
                        address: { ...location.address, city: value }
                      })}
                      placeholder="Enter city"
                      required
                    />

                    <SelectField
                      label="State"
                      name={`state-${index}`}
                      value={location.address?.state || ""}
                      onChange={(value) => onContactLocationChange(index, {
                        ...location,
                        address: { ...location.address, state: value }
                      })}
                      options={stateOptions}
                      required
                    />

                    <InputField
                      label="ZIP Code"
                      name={`zip-${index}`}
                      value={location.address?.zipCode || ""}
                      onChange={(value) => onContactLocationChange(index, {
                        ...location,
                        address: { ...location.address, zipCode: value }
                      })}
                      placeholder="Enter ZIP code"
                      required
                    />

                    <InputField
                      label="Country"
                      name={`country-${index}`}
                      value={location.address?.country || "United States"}
                      onChange={(value) => onContactLocationChange(index, {
                        ...location,
                        address: { ...location.address, country: value }
                      })}
                      placeholder="Enter country"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Phone Number"
                    name={`phone-${index}`}
                    value={location.phone || ""}
                    onChange={(value) => onContactLocationChange(index, { ...location, phone: value })}
                    placeholder="Enter phone number"
                    required
                    mask="phone"
                    icon={<Phone className="w-4 h-4" />}
                  />

                  <InputField
                    label="Email Address"
                    name={`email-${index}`}
                    type="email"
                    value={location.email || ""}
                    onChange={(value) => onContactLocationChange(index, { ...location, email: value })}
                    placeholder="Enter email address"
                    required
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>
              </motion.div>
            ))}

            <button
              onClick={onAddContactLocation}
              className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-heart/50 transition-all bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="flex items-center justify-center gap-2 text-purple-heart">
                <Plus className="w-5 h-5" />
                Add Additional Location
              </div>
            </button>
          </div>
        )}

        {/* Payout & Tax Section */}
        {activeSection === 'payout' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Payout & Tax Information</h2>
              <p className="text-muted-foreground">
                Set up your banking and tax information for payments
              </p>
            </div>

            {/* Bank Account Section */}
            <div className="space-y-6 p-6 neumorph-card rounded-xl">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Bank Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Account Type"
                  name="accountType"
                  value={payoutTax.bankAccount?.accountType || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    bankAccount: { ...payoutTax.bankAccount, accountType: value as any }
                  })}
                  options={accountTypes}
                  required
                />

                <InputField
                  label="Account Holder Name"
                  name="accountHolderName"
                  value={payoutTax.bankAccount?.accountHolderName || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    bankAccount: { ...payoutTax.bankAccount, accountHolderName: value }
                  })}
                  placeholder="Name on account"
                  required
                />

                <InputField
                  label="Routing Number"
                  name="routingNumber"
                  value={payoutTax.bankAccount?.routingNumber || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    bankAccount: { ...payoutTax.bankAccount, routingNumber: value }
                  })}
                  placeholder="9-digit routing number"
                  required
                />

                <InputField
                  label="Account Number"
                  name="accountNumber"
                  value={payoutTax.bankAccount?.accountNumber || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    bankAccount: { ...payoutTax.bankAccount, accountNumber: value }
                  })}
                  placeholder="Account number"
                  required
                />
              </div>
            </div>

            {/* Tax Information Section */}
            <div className="space-y-6 p-6 neumorph-card rounded-xl">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tax Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Tax ID Type"
                  name="taxIdType"
                  value={payoutTax.taxInfo?.taxIdType || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    taxInfo: { ...payoutTax.taxInfo, taxIdType: value as any }
                  })}
                  options={taxIdTypes}
                  required
                />

                <InputField
                  label="Tax ID Number"
                  name="taxId"
                  value={payoutTax.taxInfo?.taxId || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    taxInfo: { ...payoutTax.taxInfo, taxId: value }
                  })}
                  placeholder="Enter tax ID"
                  required
                  mask={payoutTax.taxInfo?.taxIdType === 'ssn' ? 'ssn' : payoutTax.taxInfo?.taxIdType === 'ein' ? 'ein' : undefined}
                />
              </div>

              {payoutTax.taxInfo?.taxIdType === 'ein' && (
                <InputField
                  label="Corporate Tax ID (if different)"
                  name="corporateTaxId"
                  value={payoutTax.taxInfo?.corporateTaxId || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    taxInfo: { ...payoutTax.taxInfo, corporateTaxId: value }
                  })}
                  placeholder="Corporate tax ID"
                  mask="ein"
                />
              )}

              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> You'll need to complete W-9 or W-8BEN forms electronically in the next step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8">
        <button
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-purple-heart hover:text-purple-heart transition-all shadow-sm"
        >
          Back to Role Selection
        </button>

        <button
          onClick={onContinue}
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-purple-heart to-royal-blue text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-0"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            'Continue to Credentials'
          )}
        </button>
      </div>
    </div>
  );
}