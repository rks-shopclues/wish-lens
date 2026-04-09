import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'lalchandani_labs';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL);
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db(DB_NAME);
  return cachedDb;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ============ SEED DATA ============
function getTestsSeedData() {
  return [
    {
      id: uuidv4(),
      name: "Complete Blood Count (CBC)",
      shortName: "CBC",
      category: "Haematology",
      price: 299,
      originalPrice: 450,
      tat: "6 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Comprehensive blood analysis measuring RBC, WBC, platelets, hemoglobin, and hematocrit levels to detect infections, anemia, and blood disorders.",
      parameters: 22,
      popular: true,
      homeCollection: true,
      icon: "droplet",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "Vitamin D (25-OH)",
      shortName: "Vit D",
      category: "Biochemistry",
      price: 599,
      originalPrice: 899,
      tat: "24 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Measures 25-hydroxyvitamin D levels to assess vitamin D deficiency or toxicity, crucial for bone health.",
      parameters: 1,
      popular: true,
      homeCollection: true,
      icon: "sun",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "Thyroid Profile (T3, T4, TSH)",
      shortName: "Thyroid",
      category: "Endocrinology",
      price: 499,
      originalPrice: 750,
      tat: "6 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Complete thyroid function assessment measuring T3, T4, and TSH hormone levels for thyroid disorders.",
      parameters: 3,
      popular: true,
      homeCollection: true,
      icon: "activity",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "Lipid Profile",
      shortName: "Lipid",
      category: "Biochemistry",
      price: 399,
      originalPrice: 600,
      tat: "6 Hours",
      fastingInfo: "10-12 Hrs Fasting Required",
      fastingRequired: true,
      description: "Evaluates cardiovascular risk by measuring total cholesterol, HDL, LDL, VLDL, and triglycerides.",
      parameters: 8,
      popular: true,
      homeCollection: true,
      icon: "heart",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "Liver Function Test (LFT)",
      shortName: "LFT",
      category: "Biochemistry",
      price: 449,
      originalPrice: 700,
      tat: "6 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Comprehensive liver health panel including bilirubin, SGPT, SGOT, ALP, protein, and albumin levels.",
      parameters: 12,
      popular: true,
      homeCollection: true,
      icon: "flask",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "Kidney Function Test (KFT/RFT)",
      shortName: "KFT",
      category: "Biochemistry",
      price: 399,
      originalPrice: 600,
      tat: "6 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Evaluates kidney function including creatinine, urea, uric acid, BUN, and electrolytes.",
      parameters: 10,
      popular: false,
      homeCollection: true,
      icon: "activity",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "HbA1c (Glycated Hemoglobin)",
      shortName: "HbA1c",
      category: "Diabetology",
      price: 349,
      originalPrice: 500,
      tat: "6 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Measures average blood sugar levels over 2-3 months for effective diabetes management and monitoring.",
      parameters: 1,
      popular: true,
      homeCollection: true,
      icon: "pie-chart",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "Blood Sugar (Fasting)",
      shortName: "FBS",
      category: "Diabetology",
      price: 99,
      originalPrice: 150,
      tat: "4 Hours",
      fastingInfo: "10-12 Hrs Fasting Required",
      fastingRequired: true,
      description: "Measures fasting glucose level in blood to screen for diabetes and pre-diabetes conditions.",
      parameters: 1,
      popular: false,
      homeCollection: true,
      icon: "droplet",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "Urine Routine & Microscopy",
      shortName: "Urine R/M",
      category: "Clinical Pathology",
      price: 149,
      originalPrice: 250,
      tat: "4 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Complete urine analysis including physical, chemical, and microscopic examination for UTI and kidney health.",
      parameters: 15,
      popular: false,
      homeCollection: true,
      icon: "flask",
      sampleType: "Urine"
    },
    {
      id: uuidv4(),
      name: "Iron Studies (Serum Iron, TIBC, Ferritin)",
      shortName: "Iron",
      category: "Haematology",
      price: 799,
      originalPrice: 1200,
      tat: "24 Hours",
      fastingInfo: "10-12 Hrs Fasting Required",
      fastingRequired: true,
      description: "Complete iron panel measuring serum iron, TIBC, and ferritin for anemia diagnosis and monitoring.",
      parameters: 4,
      popular: false,
      homeCollection: true,
      icon: "zap",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "Vitamin B12",
      shortName: "Vit B12",
      category: "Biochemistry",
      price: 549,
      originalPrice: 800,
      tat: "24 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Measures vitamin B12 levels to diagnose deficiency causing fatigue, weakness, and neurological issues.",
      parameters: 1,
      popular: true,
      homeCollection: true,
      icon: "zap",
      sampleType: "Blood"
    },
    {
      id: uuidv4(),
      name: "C-Reactive Protein (CRP)",
      shortName: "CRP",
      category: "Immunology",
      price: 349,
      originalPrice: 500,
      tat: "6 Hours",
      fastingInfo: "No Fasting Required",
      fastingRequired: false,
      description: "Detects inflammation or infection in the body by measuring CRP protein levels in blood.",
      parameters: 1,
      popular: false,
      homeCollection: true,
      icon: "shield",
      sampleType: "Blood"
    }
  ];
}

function getPackagesSeedData() {
  return [
    {
      id: uuidv4(),
      name: "Complete Body Profile",
      price: 1199,
      originalPrice: 3630,
      description: "Comprehensive full body screening covering 74 parameters. Essential for complete health assessment.",
      testsIncluded: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid Profile", "Blood Sugar (F)", "Urine Routine", "Iron Studies"],
      testCount: 8,
      parameterCount: 74,
      popular: true,
      ageGroup: "All Ages",
      gender: "Both",
      icon: "heart",
      fastingInfo: "10-14 Hours Fasting",
      reportTime: "Same Day",
      homeCollection: true
    },
    {
      id: uuidv4(),
      name: "Gold Health Check",
      price: 1999,
      originalPrice: 5700,
      description: "Our most popular package. Gold standard screening with 78 parameters covering all vital organs.",
      testsIncluded: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid Profile", "Blood Sugar (F)", "HbA1c", "Vitamin D", "Urine Routine", "Iron Studies"],
      testCount: 10,
      parameterCount: 78,
      popular: true,
      ageGroup: "All Ages",
      gender: "Both",
      icon: "shield",
      recommended: true,
      fastingInfo: "10-14 Hours Fasting",
      reportTime: "Same Day",
      homeCollection: true
    },
    {
      id: uuidv4(),
      name: "Platinum Health Check",
      price: 2999,
      originalPrice: 5700,
      description: "Premium comprehensive screening with 81 parameters. The most thorough health checkup we offer.",
      testsIncluded: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid Profile", "Blood Sugar (F)", "HbA1c", "Vitamin D", "Vitamin B12", "Iron Studies", "CRP", "Urine Routine"],
      testCount: 12,
      parameterCount: 81,
      popular: true,
      ageGroup: "All Ages",
      gender: "Both",
      icon: "users",
      fastingInfo: "10-14 Hours Fasting",
      reportTime: "Same Day",
      homeCollection: true
    },
    {
      id: uuidv4(),
      name: "Women's Wellness Package",
      price: 1999,
      originalPrice: 3500,
      description: "Specialized screening for women's health including hormonal and nutritional assessment.",
      testsIncluded: ["CBC", "Thyroid Profile", "Iron Studies", "Vitamin D", "Vitamin B12", "Blood Sugar (F)", "Urine Routine"],
      testCount: 7,
      parameterCount: 55,
      popular: true,
      ageGroup: "18+ Years",
      gender: "Female",
      icon: "heart"
    },
    {
      id: uuidv4(),
      name: "Senior Citizen Package",
      price: 2999,
      originalPrice: 5500,
      description: "Comprehensive screening for 60+. Covers heart, diabetes, kidney, liver & bone health.",
      testsIncluded: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid", "HbA1c", "FBS", "Vit D", "Vit B12", "Iron", "CRP", "Urine R/M"],
      testCount: 12,
      parameterCount: 98,
      popular: true,
      ageGroup: "60+ Years",
      gender: "Both",
      icon: "users"
    },
    {
      id: uuidv4(),
      name: "Diabetes Care Package",
      price: 1499,
      originalPrice: 2500,
      description: "Focused screening for diabetes management and early complication detection.",
      testsIncluded: ["Blood Sugar (F)", "HbA1c", "KFT", "Lipid Profile", "Urine Routine"],
      testCount: 5,
      parameterCount: 35,
      popular: false,
      ageGroup: "All Ages",
      gender: "Both",
      icon: "activity"
    }
  ];
}

// ============ HANDLERS ============

async function seedDatabase(request) {
  try {
    const db = await connectToDatabase();
    const url = request ? new URL(request.url) : null;
    const force = url?.searchParams?.get('force') === 'true';
    
    if (force) {
      await db.collection('tests').deleteMany({});
      await db.collection('packages').deleteMany({});
    }
    
    const existingTests = await db.collection('tests').countDocuments();
    if (existingTests > 0) {
      return NextResponse.json({ message: 'Database already seeded', tests: existingTests }, { headers: corsHeaders() });
    }
    const tests = getTestsSeedData();
    const packages = getPackagesSeedData();
    await db.collection('tests').insertMany(tests);
    await db.collection('packages').insertMany(packages);
    return NextResponse.json({ message: 'Database seeded successfully', testsInserted: tests.length, packagesInserted: packages.length }, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function getTests(request) {
  try {
    const db = await connectToDatabase();
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const popular = url.searchParams.get('popular');
    let filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (popular === 'true') filter.popular = true;
    const tests = await db.collection('tests').find(filter).toArray();
    const cleaned = tests.map(({ _id, ...rest }) => rest);
    return NextResponse.json({ tests: cleaned }, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function getPackages() {
  try {
    const db = await connectToDatabase();
    const packages = await db.collection('packages').find({}).toArray();
    const cleaned = packages.map(({ _id, ...rest }) => rest);
    return NextResponse.json({ packages: cleaned }, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function createLead(request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { mobile, pincode } = body;
    if (!mobile || !pincode) {
      return NextResponse.json({ error: 'Mobile and pincode are required' }, { status: 400, headers: corsHeaders() });
    }
    const lead = {
      id: uuidv4(),
      mobile,
      pincode,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    await db.collection('leads').insertOne(lead);
    return NextResponse.json({ message: 'We will call you back within 15 minutes!', lead: { id: lead.id } }, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function addToCart(request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { sessionId, itemId, itemType, name, price } = body;
    if (!sessionId || !itemId || !name || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders() });
    }
    const existing = await db.collection('cart').findOne({ sessionId, itemId });
    if (existing) {
      const cartItems = await db.collection('cart').find({ sessionId }).toArray();
      const cleaned = cartItems.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ message: 'Item already in cart', cart: cleaned }, { headers: corsHeaders() });
    }
    const cartItem = {
      id: uuidv4(),
      sessionId,
      itemId,
      itemType: itemType || 'test',
      name,
      price,
      addedAt: new Date().toISOString()
    };
    await db.collection('cart').insertOne(cartItem);
    const cartItems = await db.collection('cart').find({ sessionId }).toArray();
    const cleaned = cartItems.map(({ _id, ...rest }) => rest);
    return NextResponse.json({ message: 'Added to cart', cart: cleaned }, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function getCart(request, sessionId) {
  try {
    const db = await connectToDatabase();
    const cartItems = await db.collection('cart').find({ sessionId }).toArray();
    const cleaned = cartItems.map(({ _id, ...rest }) => rest);
    return NextResponse.json({ cart: cleaned }, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function removeFromCart(request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { sessionId, itemId } = body;
    await db.collection('cart').deleteOne({ sessionId, itemId });
    const cartItems = await db.collection('cart').find({ sessionId }).toArray();
    const cleaned = cartItems.map(({ _id, ...rest }) => rest);
    return NextResponse.json({ message: 'Removed from cart', cart: cleaned }, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function sendOTP(request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { mobile } = body;
    if (!mobile || mobile.length !== 10) {
      return NextResponse.json({ error: 'Valid 10-digit mobile number required' }, { status: 400, headers: corsHeaders() });
    }
    const otp = '123456';
    await db.collection('otps').updateOne(
      { mobile },
      { $set: { mobile, otp, createdAt: new Date(), expiresAt: new Date(Date.now() + 5 * 60 * 1000) } },
      { upsert: true }
    );
    return NextResponse.json({ message: 'OTP sent successfully', hint: 'For testing, use OTP: 123456' }, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function verifyOTP(request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { mobile, otp } = body;
    const record = await db.collection('otps').findOne({ mobile });
    if (!record || record.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400, headers: corsHeaders() });
    }
    if (new Date() > new Date(record.expiresAt)) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400, headers: corsHeaders() });
    }
    let user = await db.collection('users').findOne({ mobile });
    if (!user) {
      user = { id: uuidv4(), mobile, createdAt: new Date().toISOString() };
      await db.collection('users').insertOne(user);
    }
    await db.collection('otps').deleteOne({ mobile });
    return NextResponse.json({ message: 'OTP verified successfully', user: { id: user.id, mobile: user.mobile } }, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function uploadPrescription(request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { fileName, fileType, fileSize, mobile, sessionId } = body;
    const prescription = {
      id: uuidv4(),
      fileName,
      fileType,
      fileSize,
      mobile: mobile || null,
      sessionId,
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };
    await db.collection('prescriptions').insertOne(prescription);
    return NextResponse.json({ 
      message: 'Prescription uploaded! Our doctor will review it and call you to finalize your booking.',
      prescription: { id: prescription.id, status: prescription.status }
    }, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

async function createBooking(request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { userId, sessionId, items, collectionType, address, timeSlot, paymentMethod, totalAmount, patientName, patientAge, patientGender, mobile } = body;
    const booking = {
      id: uuidv4(),
      userId: userId || null,
      sessionId,
      items: items || [],
      collectionType: collectionType || 'home',
      address: address || null,
      timeSlot: timeSlot || null,
      paymentMethod: paymentMethod || 'pay_at_home',
      totalAmount,
      patientName,
      patientAge,
      patientGender,
      mobile,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    await db.collection('bookings').insertOne(booking);
    if (sessionId) {
      await db.collection('cart').deleteMany({ sessionId });
    }
    return NextResponse.json({ 
      message: 'Booking confirmed! Our phlebotomist will arrive at your selected time.',
      booking: { id: booking.id, status: booking.status }
    }, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

// ============ ROUTE HANDLING ============

export async function GET(request, context) {
  const { path } = await context.params;
  if (!path || path.length === 0) {
    return NextResponse.json({ message: 'Dr. Lalchandani Labs API', version: '1.0' }, { headers: corsHeaders() });
  }
  const pathStr = path.join('/');
  if (pathStr === 'tests') return getTests(request);
  if (pathStr === 'packages') return getPackages();
  if (path[0] === 'cart' && path.length === 2) return getCart(request, path[1]);
  if (pathStr === 'health') return NextResponse.json({ status: 'healthy' }, { headers: corsHeaders() });
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() });
}

export async function POST(request, context) {
  const { path } = await context.params;
  if (!path) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() });
  }
  const pathStr = path.join('/');
  if (pathStr === 'seed') return seedDatabase(request);
  if (pathStr === 'leads') return createLead(request);
  if (pathStr === 'cart/add') return addToCart(request);
  if (pathStr === 'cart/remove') return removeFromCart(request);
  if (pathStr === 'auth/send-otp') return sendOTP(request);
  if (pathStr === 'auth/verify-otp') return verifyOTP(request);
  if (pathStr === 'prescriptions') return uploadPrescription(request);
  if (pathStr === 'bookings') return createBooking(request);
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() });
}

export async function DELETE(request, context) {
  const { path } = await context.params;
  if (!path) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() });
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
