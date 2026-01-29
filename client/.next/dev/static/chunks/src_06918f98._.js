(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/constants/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BOOKING_STEPS",
    ()=>BOOKING_STEPS,
    "CARS",
    ()=>CARS,
    "CAR_IMAGES",
    ()=>CAR_IMAGES,
    "FAQS",
    ()=>FAQS,
    "RENTAL_RATES_BY_CAR",
    ()=>RENTAL_RATES_BY_CAR,
    "RENTAL_TERMS",
    ()=>RENTAL_TERMS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-client] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
;
const CARS = [
    {
        id: 1,
        model: "Tesla Model 3",
        brand: "Tesla",
        type: "Luxury",
        price_per_day: 95,
        image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80",
        transmission: "Automatic",
        fuel_type: "Electric",
        seats: 5,
        description: "The Tesla Model 3 is designed for electric performance, with dual motor AWD, quick acceleration, long range and fast charging.",
        is_available: true,
        max_speed_kmh: 261,
        acceleration_sec: 3.3,
        horsepower: 510
    },
    {
        id: 2,
        brand: "Lexus",
        type: "Luxury SUV",
        price_per_day: 180,
        image_url: "https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHg1NzB8ZW58MHx8MHx8fDA%3D",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seats: 7,
        description: "The Lexus LX 570 features a 5.7L V8 engine with around 383 hp and 4WD luxury performance with premium leather interior and advanced safety suite.",
        is_available: true,
        max_speed_kmh: 220,
        acceleration_sec: 7.3,
        horsepower: 383,
        model: "Lexus LX 570"
    },
    {
        id: 3,
        brand: "Lexus",
        type: "Luxury SUV",
        price_per_day: 220,
        image_url: "https://hips.hearstapps.com/hmg-prod/images/2025-lexus-lx600-f-sport-exterior-pr-103-6864352bba6da.jpg?crop=0.708xw:0.598xh;0.145xw,0.304xh&resize=1200:*",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seats: 7,
        description: "The Lexus LX 600 comes with a 3.5L twin-turbo V6 producing ~409 hp, advanced infotainment, full-time 4WD, and a premium spacious interior with modern tech. :contentReference[oaicite:0]{index=0}",
        is_available: true,
        max_speed_kmh: 210,
        acceleration_sec: 6.9,
        horsepower: 409,
        model: ""
    },
    {
        id: 4,
        model: "Lexus LX 700h Overtrail",
        brand: "Lexus",
        type: "Luxury Hybrid SUV",
        price_per_day: 260,
        image_url: "https://lexusenthusiast.com/images/weblog/20241010_01_02-1200x640.jpg",
        transmission: "Automatic",
        fuel_type: "Hybrid",
        seats: 7,
        description: "The LX 700h adds a 3.4L twin-turbo hybrid V6 with around 457 hp and 583 lb-ft torque, plus overlanding-ready features like differential locks and a waterproofed hybrid system. :contentReference[oaicite:1]{index=1}",
        is_available: true,
        max_speed_kmh: 200,
        acceleration_sec: 6.5,
        horsepower: 457
    },
    {
        id: 5,
        model: "Lexus LC 500",
        brand: "Lexus",
        type: "Luxury Coupe",
        price_per_day: 300,
        image_url: "https://hips.hearstapps.com/hmg-prod/images/2024-lexus-lc-500-convertible-117-655d765c34a2d.jpg?crop=0.764xw:0.647xh;0.115xw,0.262xh&resize=2048:*",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seats: 4,
        description: "The Lexus LC is a luxury grand tourer with striking design, premium materials, and a front-engine, rear-drive layout. The LC500 coupe is powered by a V8, blending performance and elegance. :contentReference[oaicite:2]{index=2}",
        is_available: true,
        max_speed_kmh: 270,
        acceleration_sec: 4.4,
        horsepower: 471
    },
    {
        id: 6,
        model: "Mercedes-AMG GT 63 S E PERFORMANCE",
        brand: "Mercedes-AMG",
        type: "Luxury Supercar",
        price_per_day: 450,
        image_url: "https://www.topgear.com/sites/default/files/2022/04/1-Mercedes-AMG-GT-63-S-E-Performance.jpg",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seats: 4,
        description: "Combines a handcrafted AMG 4.0L V8 twin-turbo with an electric motor for massive performance and supreme driving dynamics.",
        is_available: true,
        max_speed_kmh: 316,
        acceleration_sec: 2.9,
        horsepower: 831
    },
    {
        id: 7,
        model: "Audi R8 V10 Performance",
        brand: "Audi",
        type: "Supercar",
        price_per_day: 480,
        image_url: "https://www.luxurylifestylemag.co.uk/wp-content/uploads/2020/04/A1813694_large.jpg",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seats: 2,
        description: "Mid-engine 5.2L V10 supercar with quattro all-wheel drive and blistering acceleration — an icon of Audi performance.",
        is_available: true,
        max_speed_kmh: 331,
        acceleration_sec: 3.1,
        horsepower: 602
    }
];
const BOOKING_STEPS = [
    {
        number: "01",
        title: "Choose your car",
        description: "Pick the premium model that suits your style and plans."
    },
    {
        number: "02",
        title: "Contact Us",
        description: "Reach out and reserve your dates."
    },
    {
        number: "03",
        title: "Confirm & Secure",
        description: "Send documents, pay deposit and we'll handle the rest."
    },
    {
        number: "04",
        title: "Drive Away",
        description: "We deliver the car to your desired location."
    }
];
const RENTAL_TERMS = [
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        title: "21 years",
        subtitle: "Minimum age"
    },
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        title: "2 documents",
        subtitle: "Passport and Driver's License"
    },
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"],
        title: "1 year",
        subtitle: "Of driving experience"
    },
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"],
        title: "From 1000$",
        subtitle: "Security deposit"
    }
];
const FAQS = [
    {
        question: "Машин ашиглах нөхцөл, дүрэм юу вэ?",
        answer: "Танд хүчинтэй жолоочийн үнэмлэх байх, жолоочийн насны шаардлагыг хангах, мөн түрээсийн хугацаанд бүх түрээсийн гэрээний нөхцлийг дагах шаардлагатай."
    },
    {
        question: "Машиныг хотын гадна жолоодож болох уу?",
        answer: "Тийм, та машиныг хотын хязгаараас гадна жолоодож болно, гэхдээ маршрутыг түрээсийн гэрээнд заасан зөвшөөрөгдсөн бүс нутгаар хязгаарлах ёстой. Урьдчилан мэдэгдэж, гэрээнд тэмдэглүүлэхийг зөвлөж байна."
    },
    {
        question: "Түлшний бодлого юу вэ?",
        answer: "Машиныг авах үед байсан түлшний түвшинд буцааж өгөх ёстой. Үгүй бол шатахууны төлбөр нэмэгдэнэ."
    },
    {
        question: "Машиныг хуримд чимэглэх боломжтой юу?",
        answer: "Тийм, хөнгөн чимэглэл хийх боломжтой бөгөөд машиныг гэмтээхгүйгээр суурилуулж, буцаахын өмнө арилгах шаардлагатай."
    },
    {
        question: "Жолоочийн үйлчилгээ санал болгодог уу?",
        answer: "Тийм, нэмэлт төлбөрийн төлөө мэргэжлийн жолоочийг хүсэлтээр олгож болно."
    },
    {
        question: "Машиныг тогтоосон цагаас хоцорвол яах болох вэ?",
        answer: "Та  машиныг тогтоосон цагаас хоцорвол түрээсийн гэрээнд заасан цаг тутмын нэмэлт төлбөр ногдуулж бодно."
    }
];
const RENTAL_RATES_BY_CAR = {
    1: [
        {
            season: null,
            price_per_day: 350000
        },
        {
            season: "winter",
            start_date: "2025-11-01",
            end_date: "2026-03-31",
            price_per_day: 300000
        },
        {
            season: "summer",
            start_date: "2025-06-01",
            end_date: "2025-08-31",
            price_per_day: 400000
        }
    ],
    2: [
        {
            season: null,
            price_per_day: 500000
        },
        {
            season: "winter",
            start_date: "2025-11-01",
            end_date: "2026-03-31",
            price_per_day: 450000
        }
    ],
    3: [
        {
            season: null,
            price_per_day: 500000
        },
        {
            season: "winter",
            start_date: "2025-11-01",
            end_date: "2026-03-31",
            price_per_day: 450000
        }
    ],
    4: [
        {
            season: null,
            price_per_day: 500000
        },
        {
            season: "winter",
            start_date: "2025-11-01",
            end_date: "2026-03-31",
            price_per_day: 450000
        }
    ],
    5: [
        {
            season: null,
            price_per_day: 500000
        },
        {
            season: "winter",
            start_date: "2025-11-01",
            end_date: "2026-03-31",
            price_per_day: 450000
        }
    ],
    6: [
        {
            season: null,
            price_per_day: 500000
        },
        {
            season: "winter",
            start_date: "2025-11-01",
            end_date: "2026-03-31",
            price_per_day: 450000
        }
    ],
    7: [
        {
            season: null,
            price_per_day: 500000
        },
        {
            season: "winter",
            start_date: "2025-11-01",
            end_date: "2026-03-31",
            price_per_day: 450000
        }
    ]
};
const CAR_IMAGES = {
    1: [
        "https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc",
        "https://hips.hearstapps.com/hmg-prod/images/2024-lexus-lc-500-convertible-117.jpg",
        "https://hips.hearstapps.com/hmg-prod/images/2025-lexus-lx600-f-sport-exterior.jpg"
    ],
    2: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
    ],
    3: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
    ],
    4: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
    ],
    5: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
    ],
    6: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
    ],
    7: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
    ]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/cars/Thumbnails.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThumbnailImageGallery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const SWIPE_THRESHOLD = 80;
const variants = {
    enter: (direction)=>({
            x: direction > 0 ? 120 : -120,
            opacity: 0,
            scale: 1.05
        }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction)=>({
            x: direction > 0 ? -120 : 120,
            opacity: 0,
            scale: 0.95
        })
};
function ThumbnailImageGallery({ images, alt = "slider image" }) {
    _s();
    const [[index, direction], setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        0,
        0
    ]);
    const activeIndex = (index % images.length + images.length) % images.length;
    const paginate = (dir)=>{
        setState([
            index + dir,
            dir
        ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col space-y-4 w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full aspect-video overflow-hidden rounded-2xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    initial: false,
                    custom: direction,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        custom: direction,
                        variants: variants,
                        initial: "enter",
                        animate: "center",
                        exit: "exit",
                        transition: {
                            x: {
                                type: "spring",
                                stiffness: 280,
                                damping: 28
                            },
                            opacity: {
                                duration: 0.25
                            }
                        },
                        drag: "x",
                        dragConstraints: {
                            left: 0,
                            right: 0
                        },
                        dragElastic: 0.9,
                        onDragEnd: (_, info)=>{
                            if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
                            if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
                        },
                        className: "absolute inset-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: images[activeIndex],
                            alt: alt,
                            fill: true,
                            priority: true,
                            className: "object-cover"
                        }, void 0, false, {
                            fileName: "[project]/src/components/cars/Thumbnails.tsx",
                            lineNumber: 70,
                            columnNumber: 13
                        }, this)
                    }, index, false, {
                        fileName: "[project]/src/components/cars/Thumbnails.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/cars/Thumbnails.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/cars/Thumbnails.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            images.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: " grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(80px,1fr))] md:grid-cols-[repeat(4,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] ",
                children: images.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setState([
                                i,
                                i > activeIndex ? 1 : -1
                            ]),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("relative aspect-video rounded-xl overflow-hidden transition-all duration-300", i === activeIndex ? "ring-2 ring-white scale-95" : "opacity-60 hover:opacity-100 hover:scale-[0.98]"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: img,
                            alt: "",
                            fill: true,
                            className: "object-cover"
                        }, void 0, false, {
                            fileName: "[project]/src/components/cars/Thumbnails.tsx",
                            lineNumber: 102,
                            columnNumber: 15
                        }, this)
                    }, i, false, {
                        fileName: "[project]/src/components/cars/Thumbnails.tsx",
                        lineNumber: 92,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/cars/Thumbnails.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/cars/Thumbnails.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(ThumbnailImageGallery, "dGQxgSrnQYQRPcA/kXljwqrztgc=");
_c = ThumbnailImageGallery;
var _c;
__turbopack_context__.k.register(_c, "ThumbnailImageGallery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shared/returnbutton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
;
const Returnbutton = ({ href, text })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-300 group",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                    className: "h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300"
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/returnbutton.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: text
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/returnbutton.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shared/returnbutton.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false);
};
_c = Returnbutton;
const __TURBOPACK__default__export__ = Returnbutton;
var _c;
__turbopack_context__.k.register(_c, "Returnbutton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shared/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const Button = ({ text, href, className = "", ...props })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleClick = (e)=>{
        if (props.onClick) props.onClick(e); // 1. хэрэв onClick дамжуулсан бол ажиллана
        if (href) router.push(href); // 2. href өгөгдсөн бол route шилжүүлнэ
        window.scrollTo(0, 0);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ...props,
        onClick: handleClick,
        className: `group/button overflow-hidden relative px-5 py-3.5 rounded-full flex items-center bg-white justify-center ${className} text-black hover:bg-neutral-200 hover:shadow-lg hover:shadow-white/10 hover:scale-99 cursor-pointer transition-all duration-400 ease-in-out `,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "transition-all duration-300 ease-in-out group-hover/button:-translate-y-[150%] group-hover/button:opacity-0 ",
                children: text
            }, void 0, false, {
                fileName: "[project]/src/components/shared/button.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute top-full left-0 right-0 transition-all duration-300 ease-in-out opacity-0 group-hover/button:-translate-y-full group-hover/button:opacity-100 h-full flex items-center justify-center",
                children: text
            }, void 0, false, {
                fileName: "[project]/src/components/shared/button.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/button.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Button, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Button;
const __TURBOPACK__default__export__ = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/pricing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getActiveDailyPrice",
    ()=>getActiveDailyPrice
]);
const getActiveDailyPrice = (rates, date = new Date())=>{
    const ts = date.getTime();
    const seasonal = rates.find((r)=>r.start_date && r.end_date && ts >= new Date(r.start_date).getTime() && ts <= new Date(r.end_date).getTime());
    if (seasonal) return seasonal.price_per_day;
    const base = rates.find((r)=>r.season === null);
    return base?.price_per_day ?? 0;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/cars/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CarDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cars$2f$Thumbnails$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/cars/Thumbnails.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$returnbutton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/returnbutton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/pricing.ts [app-client] (ecmascript)");
// "use client";
// import { Users, Fuel, Gauge, ShieldCheck, Zap, Bluetooth } from "lucide-react";
// import { Car } from "@/types";
// import ThumbnailImageGallery from "@/components/cars/Thumbnails";
// import Returnbutton from "@/components/shared/returnbutton";
// import Button from "@/components/shared/button";
// import HowToRentSection from "@/components/_sections/HowToRentSection";
// import RentalTermsSection from "@/components/_sections/RentalTermsSection";
// import FAQSection from "@/components/_sections/FAQSection";
// import { CARS, CAR_IMAGES, RENTAL_RATES_BY_CAR } from "@/constants";
// import { getActiveDailyPrice } from "@/utils/pricing";
// export default function CarDetailPage({ id }: { id: number }) {
//   // 1️⃣ Car олж авна
//   const car = CARS.find((c) => c.id === id);
//   console.log("car::", car);
//   if (!car) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <p className="text-white text-xl">Car not found</p>
//       </div>
//     );
//   }
//   // 2️⃣ Нэмэлт зургууд
//   const images = CAR_IMAGES[car.id] ?? [car.image_url];
//   // 3️⃣ Car-ийн rental rates
//   const rates = RENTAL_RATES_BY_CAR[car.id] ?? [];
//   // 4️⃣ Өнөөдрийн active rate
//   const todayPrice = getActiveDailyPrice(rates);
//   return (
//     <div className="min-h-screen bg-black text-white pt-26 px-3 sm:px-12 mx-auto w-full">
//       <div className="lg:px-12 pb-6">
//         <Returnbutton href="/cars" text="Back to results" />
//       </div>
//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row gap-16">
//         {/* Left Column - Gallery */}
//         <div className="lg:flex-1 space-y-8">
//           <div className="block lg:hidden">
//             <CarTitle car={car} />
//           </div>
//           <ThumbnailImageGallery images={images} alt={car.model} />
//           <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
//             {[
//               {
//                 icon: Users,
//                 title: `${car.seats} Persons`,
//                 subtitle: "Capacity",
//               },
//               {
//                 icon: Gauge,
//                 title: car.transmission,
//                 subtitle: "Transmission",
//               },
//               { icon: Fuel, title: car.fuel_type, subtitle: "Fuel Type" },
//               {
//                 icon: Zap,
//                 title: `${car.horsepower ?? "-"} HP`,
//                 subtitle: "Performance",
//               },
//               { icon: Bluetooth, title: "Bluetooth", subtitle: "Feature" },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="group relative p-4 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/70 transition-all duration-500 hover:bg-neutral-900/70"
//               >
//                 <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 <item.icon className="h-5 w-5 text-neutral-400 mb-4" />
//                 <p className="text-base font-medium text-white">{item.title}</p>
//                 <p className="text-xs text-neutral-500">{item.subtitle}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* Right Column - Car Details */}
//         <div className="lg:flex-1 space-y-6">
//           <div className="hidden lg:block">
//             <CarTitle car={car} />
//           </div>
//           {/* Booking Card */}
//           <div className="relative p-8 rounded-3xl bg-linear-to-br from-neutral-900/80 to-neutral-950/90 backdrop-blur-xl border border-neutral-800/50 shadow-2xl shadow-black/50">
//             <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/[0.03] to-transparent pointer-events-none" />
//             <div className="relative space-y-6">
//               <div className="space-y-4">
//                 <h2 className="text-3xl font-light tracking-tight mb-8">
//                   Rental Rates
//                 </h2>
//                 <div className="space-y-0">
//                   {rates.map((rate, i) => (
//                     <div
//                       key={i}
//                       className="flex justify-between items-center py-5 border-b border-neutral-800/50"
//                     >
//                       <span className="text-neutral-300 font-light">
//                         {rate.season ?? "Base"}
//                       </span>
//                       <span className="text-white font-medium">
//                         ₮{rate.price_per_day.toLocaleString()}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 {/* Өнөөдрийн rate */}
//                 <div className="mt-4 p-4 bg-neutral-800/50 rounded-xl">
//                   <span className="text-neutral-300">Today Price:</span>
//                   <span className="text-white font-medium ml-2">
//                     ₮{todayPrice.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//               <Button
//                 text="Book Now"
//                 className="w-full rounded-xl"
//                 href={`/booking?carId=${car.id}`}
//               />
//               <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-400">
//                 <ShieldCheck className="h-4 w-4" />
//                 <span>Free cancellation up to 48h</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <RentalTermsSection />
//       <HowToRentSection />
//       <FAQSection />
//     </div>
//   );
// }
// const CarTitle = ({ car }: { car: Car }) => (
//   <div className="flex gap-4 lg:gap-8 mb-6">
//     <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
//       {car.brand} <span className="font-medium">{car.model}</span>
//     </h1>
//     <div className="md:mt-3">
//       <span
//         className="px-3 py-1.5 bg-neutral-800/60 backdrop-blur-sm
//                        text-neutral-300 text-xs md:text-base font-medium rounded-full
//                        uppercase tracking-wider border border-neutral-700/50"
//       >
//         {car.type}
//       </span>
//     </div>
//   </div>
// );
"use client";
;
;
;
;
;
;
function CarDetailPage({ id }) {
    const car = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARS"].find((c)=>c.id === id);
    if (!car) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Car not found"
    }, void 0, false, {
        fileName: "[project]/src/app/cars/[id]/page.tsx",
        lineNumber: 169,
        columnNumber: 20
    }, this);
    const images = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAR_IMAGES"][car.id] ?? [
        car.image_url
    ];
    const rates = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RENTAL_RATES_BY_CAR"][car.id] ?? [];
    const todayPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getActiveDailyPrice"])(rates);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-black text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$returnbutton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/cars",
                text: "Back"
            }, void 0, false, {
                fileName: "[project]/src/app/cars/[id]/page.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: [
                    car.brand,
                    " ",
                    car.model
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/cars/[id]/page.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cars$2f$Thumbnails$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                images: images,
                alt: car.model
            }, void 0, false, {
                fileName: "[project]/src/app/cars/[id]/page.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: car.description
            }, void 0, false, {
                fileName: "[project]/src/app/cars/[id]/page.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 p-4 bg-neutral-900 rounded-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Rental Rates"
                    }, void 0, false, {
                        fileName: "[project]/src/app/cars/[id]/page.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Today's price: $",
                            todayPrice
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/cars/[id]/page.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this),
                    rates.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                r.season ? `${r.season} (${r.start_date} - ${r.end_date})` : "Base",
                                ": $",
                                r.price_per_day
                            ]
                        }, i, true, {
                            fileName: "[project]/src/app/cars/[id]/page.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        text: "Book Now",
                        href: `/booking?carId=${car.id}`
                    }, void 0, false, {
                        fileName: "[project]/src/app/cars/[id]/page.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/cars/[id]/page.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/cars/[id]/page.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_c = CarDetailPage;
var _c;
__turbopack_context__.k.register(_c, "CarDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_06918f98._.js.map