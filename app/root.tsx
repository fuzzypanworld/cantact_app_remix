
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useEffect } from "react";

import { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  NavLink,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { createEmptyContact, getContacts } from "./data";
import appStylesHref from "./app.css?url";
import { Key } from "react";

// Define Contact type
type Contact = {
  id: Key;
  first: string;
  last: string;
  favorite: boolean;
};

// Action to create a new empty contact

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

// Loader function to fetch contacts
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};



export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
  navigation.location &&
  new URLSearchParams(navigation.location.search).has(
    "q"
  );
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      
        <div id="detail">
        {
            navigation.state === "loading" ? "" : ""
          }
          <Outlet />
        </div>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            {/* Search form */}
            <Form  id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search">
            
              <input
                id="q"
                aria-label="Search contacts"
                className={searching ? "loading" : ""}
                
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
             {!searching}
            </Form>
            {/* New contact form */}
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
               {contacts.map((contact: Contact) => (
                  <li key={contact.id}>
                    <NavLink
                  className={
                    ({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}
                      {contact.favorite && <span>★</span>}
                    </Link>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Link function to add external stylesheets
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];
