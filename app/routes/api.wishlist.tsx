import { data, LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {

    
//   return {request};
    return data(request,{
       headers: {'X-Custom-Header': 'value'},
       status: 200
    })
};


// create action function to handle POST requests and handle the method to add item to wishlist
export const action = async ({ request }: LoaderFunctionArgs) => {

    const formData = await request.formData();
    const item = formData.get('item');
    // Here you would typically add the item to the wishlist in your database
    return data({ success: true, item }, {
        headers: {'X-Custom-Header': 'value'},
        status: 200
    });
}