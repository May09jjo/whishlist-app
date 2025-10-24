import prisma from "app/db.server";
import { ActionFunctionArgs, redirect } from "react-router";
// eslint-disable-next-line import/no-unresolved
import { Route } from "./+types/app.settings";

// convert or adapt the handleform to use with loaders from react router
export const loader = async () => {

 const settings = await prisma.settings.findFirst();

  console.log("Loaded settings", settings);
  return settings;

};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const storeName = formData.get("store-name");
  const businessAddress = formData.get("business-address");
  const storePhone = formData.get("store-phone");
  const currency = formData.get("currency");

// convert curerency to enum type easy way
  const convertEnum = (value: FormDataEntryValue | null) => {
    if (value === "USD") return "USD";
    if (value === "CAD") return "CAD";
    if (value === "EUR") return "EUR";
    return "USD"; // default
  }

  await prisma.settings.upsert({
    where: { id: "1" }, // assuming a single settings record with id 1
    update: {
      storeName: String(storeName),
      businessAddress: String(businessAddress),
      storePhone: String(storePhone),
      primaryCurrency: convertEnum(currency),
    },
    create: {
      id: "1",
      storeName: String(storeName),
      businessAddress: String(businessAddress),
      storePhone: String(storePhone),
      primaryCurrency: convertEnum(currency),
    },
  });

  console.log("Settings updated");

  // After a successful POST/UPsert, redirect back to the same page so the
  // loader runs and the client receives fresh loader data. Returning a 200
  // without redirect leaves the page mounted with the original loaderData,
  // which is why the UI shows stale/old values until a manual reload.
  const url = new URL(request.url);
  return redirect(url.pathname, { status: 303 });

}

export default function SettingsPage({loaderData}: Route.ComponentProps) {

  // const handleFormReset = () => {
  //   console.log("Handle discarded changes if necessary");
  // };

  // const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const formEntries = Object.fromEntries(formData);
  //   console.log("Form data", formEntries);
  // };
  console.log("Loader data in settings page", loaderData);

  return (
    <form data-save-bar method="POST">
      <s-page heading="Settings" inlineSize="small">
        {/* === */}
        {/* Store Information */}
        {/* === */}
        <s-section heading="Store Information">
          <s-text-field
            label="Store name"
            name="store-name"
            value={loaderData?.storeName || ''}
            placeholder="Enter store name"
          />
          <s-text-field
            label="Business address"
            name="business-address"
            value={loaderData?.businessAddress || ''}
            placeholder="Enter business address"
          />
          <s-text-field
            label="Store phone"
            name="store-phone"
            value={loaderData?.storePhone || ''}
            placeholder="Enter phone number"
          />
          <s-choice-list label="Primary currency" name="currency">
            <s-choice value="USD" selected={loaderData?.primaryCurrency === 'USD'}>
              US Dollar ($)
            </s-choice>
            <s-choice value="CAD" selected={loaderData?.primaryCurrency === 'CAD'}>
              Canadian Dollar (CAD)
            </s-choice>
            <s-choice value="EUR" selected={loaderData?.primaryCurrency === 'EUR'}>
              Euro (€)
            </s-choice>
          </s-choice-list>
        </s-section>

      </s-page>
    </form>
  );
}
