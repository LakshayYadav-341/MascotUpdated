import Layout from "@client/layout";
import { getLocation } from "@utils/react";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "../loading";
import Head from "./head";
import ErrorComponent from "../error";
export default function Router() {
    const slots = import.meta.glob("@client/pages/**/*.jsx", { eager: true });
    const pages = [];
    const seenLocations = new Set();

    for (const page in slots) {
        const slot = slots[page];
        const location = getLocation(page);
        if (!location || seenLocations.has(location)) {
            continue; // Skip invalid or duplicate locations
        }
        seenLocations.add(location);

        pages.push((
            <Route
                key={location}
                path={location}
                element={(
                    <Suspense fallback={<Loading />}>
                        {slot?.head && <Head head={slot?.head} key={`head-${location}`} />}
                        {slot?.layout ? (
                            <Layout data={slot?.layout}>
                                <slot.default />
                            </Layout>
                        ) : (
                            <Layout>
                                <slot.default />
                            </Layout>
                        )}
                    </Suspense>
                )}
            />
        ));
    }

    pages.push(<Route key="error-route" path="*" element={<ErrorComponent />} />);

    return (
        <Routes>
            {pages}
        </Routes>
    );
}
