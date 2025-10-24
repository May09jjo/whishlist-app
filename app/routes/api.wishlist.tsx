import { data, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import prisma from "../db.server";



// get request: accept request with request: customerId, shop, productId.
// read database and return wishlist items for that customer.
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const shop = url.searchParams.get("shop");
    const productId = url.searchParams.get("productId");


    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (!customerId || !shop || !productId) {
        return data(
        {
            ok: false,
            message: "Missing data. Required data: customerId, productId, shop",
            method: "GET",
        },
        {
            status: 400,
            headers: corsHeaders,
        }
        );
    }
    // If customerId, shop, productId is provided, return wishlist items for that customer.
    const wishlist = await prisma.wishlistItem.findMany({
        where: {
        customerId: customerId,
        shop: shop,
        productId: productId,
        },
    });

    return data(
        {
        ok: true,
        message: "Success",
        data: wishlist,
        },
        {
            status: 200,
            headers: corsHeaders 
        }
    );

}


// Expexted data comes from post request. If
// customerID, productID, shop
export async function action({ request }: ActionFunctionArgs) {

  const formData = await request.formData();
  const infoApp = Object.fromEntries(formData) as Record<string, FormDataEntryValue>;
  const customerId = infoApp.customerId as string | undefined;
  const productId = infoApp.productId as string | undefined;
  const shop = infoApp.shop as string | undefined;
  const _action = infoApp._action as string | undefined;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if(!customerId || !productId || !shop || !_action) {
    return data(
      {
        ok: false,
        message: "Missing data. Required data: customerId, productId, shop, _action",
        method: _action,
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  switch (_action) {
    case "CREATE": {
      // Add a new item to the wishlist using prisma
      const wishlist = await prisma.wishlistItem.create({
        data: {
          customerId,
          productId,
          shop,
        },
      });

      return data(
        {
          ok: true,
          message: "Product added to wishlist",
          method: _action,
          wishlisted: true,
          data: wishlist,
        },
        {
          status: 201,
          headers: corsHeaders,
        }
      );
    }

    case "PATCH": {
      // Update an existing item in the wishlist (example placeholder)
      // Implement actual update logic as needed
      return data(
        {
          ok: true,
          message: "Success",
          method: "PATCH",
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    case "DELETE": {
      // Remove item(s) from the wishlist using prisma
      await prisma.wishlistItem.deleteMany({
        where: {
          customerId: customerId,
          shop: shop,
          productId: productId,
        },
      });

      return data(
        {
          ok: true,
          message: "Product removed from your wishlist",
          method: _action,
          wishlisted: false,
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    default:
      // Method not allowed
      return new Response("Method Not Allowed", { status: 405 });
  }

}