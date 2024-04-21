"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";
const supabaseUrl = process.env.SUPABASE_PROJECT || "";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.supabase = supabase;
