"use client";

import React from "react";
import { IKContext } from "imagekitio-react";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const authenticationEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_AUTHENTICATION_ENDPOINT;

export default function ImageKitProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <IKContext
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            transformationPosition="path"
            authenticationEndpoint={authenticationEndpoint}
        >
            {children}
        </IKContext>
    );
}
