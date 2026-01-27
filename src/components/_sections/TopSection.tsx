import Link from "next/link";
import {
    Diamond,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";





export default function TopSection() {
    const { t } = useLanguage();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
            },
        },
    };
    return (
        < section className="relative min-h-screen w-full overflow-hidden bg-black" >
            {/* Background Image with Gradient Overlay */}
            < div className="absolute inset-0" >
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
                    className="h-full w-full object-cover"
                    alt="Hero Car"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div >

            {/* Content */}
            < div className="container relative mx-auto flex h-screen flex-col justify-center px-6 md:px-12" >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl space-y-8 pt-20"
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-neutral-900/80 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-md shadow-2xl"
                    >
                        <Diamond className="h-4 w-4 text-white fill-white/20" />
                        <span className="tracking-wide">{t("home.chosenBy")}</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl font-black leading-[1.1] tracking-tighter text-white md:text-8xl lg:text-9xl"
                    >
                        Premium <br />
                        <span className="text-neutral-500 font-medium tracking-tight whitespace-pre-wrap">
                            {t("home.premiumRental").replace("Premium ", "")}
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="max-w-xl text-lg text-neutral-400 md:text-xl leading-relaxed font-medium"
                    >
                        {t("home.heroDescription")}
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-4 sm:flex-row pt-4"
                    >
                        <Link
                            href="/cars"
                            className="inline-flex items-center justify-center rounded-full bg-white px-10 max-md:px-1 py-5 max-md:py-3 text-lg font-bold text-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl hover:bg-neutral-100"
                        >
                            {t("home.chooseCar")}
                        </Link>
                    </motion.div>
                </motion.div>
            </div >
        </section >
    )
}