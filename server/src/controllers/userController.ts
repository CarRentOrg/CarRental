import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Please provide all fields' });
            return;
        }

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single() as { data: UserRow | null };

        if (existingUser) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const { data: newUser, error } = await (supabase.from('users') as any)
            .insert({
                name,
                email,
                password: hashedPassword,
                role: 'user'
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: generateToken(newUser.id, newUser.role)
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single() as { data: UserRow | null, error: any };

        if (!user || error) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        next(error);
    }
};

export const getUserData = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', req.user.id)
            .single() as { data: Partial<UserRow> | null, error: any };

        if (error || !user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const getCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { data: cars, error } = await supabase.from('cars').select('*');
        if (error) throw error;
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        next(error);
    }
};
