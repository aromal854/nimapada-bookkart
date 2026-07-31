import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  inkNavy:    "#1B1F3B",
  paperWhite: "#FAFAF8",
  parchment:  "#F0EDE6",
  goldLeaf:   "#C9A84C",
  goldLight:  "#E8D48A",
  periwinkle: "#6B7FD7",
  walnut:     "#3D2B1F",
  slate:      "#64748B",
  slateLight: "#94A3B8",
  red:        "#DC2626",
  green:      "#16A34A",
  surface:    "#FFFFFF",
  border:     "#E2DDD6",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const BOOKS = [
  { id:1, title:"ବ୍ୟକ୍ତିତ୍ୱ ବିକାଶ", author:"Dr. Sarat Panda", price:299, original:450, rating:4.8, reviews:312, category:"Self Help", lang:"Odia", stock:45, img:"📖", sales:1240, views:5600, badge:"Bestseller" },
  { id:2, title:"ଓଡ଼ିଆ ସାହିତ୍ୟ ସଂଗ୍ରହ", author:"Fakir Mohan Senapati", price:599, original:799, rating:4.9, reviews:528, category:"Literature", lang:"Odia", stock:12, img:"📚", sales:980, views:4200, badge:"Classic" },
  { id:3, title:"The Odia Odyssey", author:"Pratibha Ray", price:449, original:599, rating:4.7, reviews:201, category:"Fiction", lang:"English", stock:67, img:"🌊", sales:756, views:3100, badge:"Award Winner" },
  { id:4, title:"ଆତ୍ମ ଜୀବନୀ", author:"Gopabandhu Das", price:349, original:499, rating:4.6, reviews:445, category:"Autobiography", lang:"Odia", stock:8, img:"✍️", sales:645, views:2800, badge:"Low Stock" },
  { id:5, title:"Children of Odisha", author:"Manoj Das", price:249, original:349, rating:4.5, reviews:178, category:"Children", lang:"English", stock:134, img:"🎨", sales:520, views:2100, badge:"New" },
  { id:6, title:"ଗୃହ ଲକ୍ଷ୍ମୀ", author:"Radhamohan Gadanayak", price:199, original:299, rating:4.4, reviews:89, category:"Poetry", lang:"Odia", stock:0, img:"🌺", sales:410, views:1900, badge:"Out of Stock" },
  { id:7, title:"Vedic Mathematics", author:"R.K. Mishra", price:399, original:549, rating:4.7, reviews:267, category:"Academic", lang:"Hindi", stock:88, img:"🔢", sales:890, views:3400, badge:"Popular" },
  { id:8, title:"ଶ୍ରୀ ଜଗନ୍ନାଥ", author:"Pandit Nilakantha Das", price:299, original:399, rating:4.9, reviews:621, category:"Religious", lang:"Odia", stock:55, img:"🏛️", sales:1100, views:4800, badge:"Bestseller" },
];

const AUTHORS = [
  { id:1, name:"Pratibha Ray", books:34, img:"👩‍💼", bio:"Padma Bhushan awardee", specialty:"Fiction & Social" },
  { id:2, name:"Manoj Das", books:28, img:"👨‍🏫", bio:"Padma Bhushan awardee", specialty:"Fiction & Philosophy" },
  { id:3, name:"Fakir Mohan Senapati", books:15, img:"📜", bio:"Father of Odia literature", specialty:"Classic Literature" },
  { id:4, name:"Gopabandhu Das", books:22, img:"🎓", bio:"Utkalamani, freedom fighter", specialty:"Social & Poetry" },
];

const CATS = ["All","Literature","Fiction","Autobiography","Poetry","Children","Academic","Religious","Self Help"];

const ORDERS = [
  { id:"ORD-2847", customer:"Rahul Mohanty", book:"ବ୍ୟକ୍ତିତ୍ୱ ବିକାଶ", amount:299, status:"Delivered", date:"Jun 14, 2026" },
  { id:"ORD-2846", customer:"Priya Nayak", book:"ଓଡ଼ିଆ ସାହିତ୍ୟ ସଂଗ୍ରହ", amount:599, status:"Shipped", date:"Jun 13, 2026" },
  { id:"ORD-2845", customer:"Suresh Panda", book:"The Odia Odyssey", amount:449, status:"Processing", date:"Jun 13, 2026" },
  { id:"ORD-2844", customer:"Anita Behera", book:"ଶ୍ରୀ ଜଗନ୍ନାଥ", amount:299, status:"Pending", date:"Jun 12, 2026" },
  { id:"ORD-2843", customer:"Bikash Sahu", book:"Vedic Mathematics", amount:399, status:"Cancelled", date:"Jun 11, 2026" },
];

const MONTHLY = [
  { m:"Jan", rev:42000, orders:140 }, { m:"Feb", rev:58000, orders:193 },
  { m:"Mar", rev:51000, orders:170 }, { m:"Apr", rev:73000, orders:243 },
  { m:"May", rev:89000, orders:297 }, { m:"Jun", rev:67000, orders:223 },
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Delivered: { bg:"#DCFCE7", color:"#15803D" },
    Shipped:   { bg:"#DBEAFE", color:"#1D4ED8" },
    Processing:{ bg:"#FEF9C3", color:"#A16207" },
    Pending:   { bg:"#FEF3C7", color:"#D97706" },
    Cancelled: { bg:"#FEE2E2", color:"#B91C1C" },
    Returned:  { bg:"#F3E8FF", color:"#7C3AED" },
  };
  const s = map[status] || { bg:"#F1F5F9", color:"#475569" };
  return (
    <span style={{ background:s.bg, color:s.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:.5 }}>
      {status}
    </span>
  );
};

// ─── STAR RATING ──────────────────────────────────────────────────────────────
const Stars = ({ rating, size=12 }) => (
  <span style={{ display:"inline-flex", gap:1 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize:size, color: i <= Math.round(rating) ? T.goldLeaf : T.border }}>★</span>
    ))}
  </span>
);

// ─── MINI SPARKLINE ───────────────────────────────────────────────────────────
const Sparkline = ({ data, color }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v,i) => `${(i/(data.length-1))*100},${100-((v-min)/(max-min||1))*80}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" style={{ width:60, height:30, overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── BAR CHART (MINI) ────────────────────────────────────────────────────────
const BarChart = ({ data, height=120 }) => {
  const max = Math.max(...data.map(d => d.rev));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height, padding:"0 4px" }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{
            width:"100%", background:`linear-gradient(180deg, ${T.periwinkle}, ${T.inkNavy})`,
            borderRadius:"4px 4px 0 0", height:`${(d.rev/max)*90}%`,
            opacity: i === data.length-1 ? 0.7 : 1,
            transition:"height .3s ease"
          }} />
          <span style={{ fontSize:9, color:T.slate, fontWeight:600 }}>{d.m}</span>
        </div>
      ))}
    </div>
  );
};

// ─── BOOK CARD ────────────────────────────────────────────────────────────────
const BookCard = ({ book, onAddCart, onView, compact }) => {
  const [hov, setHov] = useState(false);
  const disc = Math.round((1 - book.price/book.original)*100);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onView(book)}
      style={{
        background: T.surface,
        border: `1px solid ${hov ? T.goldLeaf : T.border}`,
        borderRadius: 16,
        overflow:"hidden",
        cursor:"pointer",
        transition:"all .25s ease",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? `0 16px 40px rgba(27,31,59,.13)` : `0 2px 8px rgba(0,0,0,.05)`,
      }}
    >
      {/* Cover */}
      <div style={{
        background:`linear-gradient(135deg, ${T.inkNavy}15, ${T.parchment})`,
        height: compact ? 140 : 180,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: compact ? 48 : 64,
        position:"relative",
        transition:"transform .3s ease",
      }}>
        <span style={{ transform: hov ? "rotate(-6deg) scale(1.1)" : "none", transition:"transform .3s ease", display:"block" }}>
          {book.img}
        </span>
        {book.badge && (
          <span style={{
            position:"absolute", top:10, left:10,
            background: book.badge === "Out of Stock" ? T.slate : book.badge === "Low Stock" ? "#D97706" : T.goldLeaf,
            color: book.badge === "Out of Stock" || book.badge === "Low Stock" ? "#fff" : T.walnut,
            fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20, letterSpacing:.5
          }}>{book.badge}</span>
        )}
        {disc > 0 && (
          <span style={{
            position:"absolute", top:10, right:10,
            background:"#DC2626", color:"#fff",
            fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20
          }}>-{disc}%</span>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: compact ? "10px 12px 12px" : "14px 16px 16px" }}>
        <div style={{ fontSize:10, color:T.periwinkle, fontWeight:700, letterSpacing:.8, textTransform:"uppercase", marginBottom:4 }}>
          {book.category} · {book.lang}
        </div>
        <div style={{
          fontFamily:"'Playfair Display', Georgia, serif",
          fontSize: compact ? 13 : 15, fontWeight:700, color:T.inkNavy,
          lineHeight:1.3, marginBottom:3,
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"
        }}>{book.title}</div>
        <div style={{ fontSize:11, color:T.slate, marginBottom:8 }}>{book.author}</div>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:10 }}>
          <Stars rating={book.rating} size={10} />
          <span style={{ fontSize:10, color:T.slate }}>({book.reviews})</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <span style={{ fontWeight:800, color:T.inkNavy, fontSize: compact ? 15 : 17 }}>₹{book.price}</span>
            {book.original !== book.price && (
              <span style={{ fontSize:11, color:T.slateLight, textDecoration:"line-through", marginLeft:5 }}>₹{book.original}</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddCart(book); }}
            style={{
              background: book.stock === 0 ? T.slate : T.inkNavy,
              color:"#fff", border:"none", borderRadius:8,
              padding: compact ? "5px 10px" : "6px 14px",
              fontSize:11, fontWeight:700, cursor: book.stock === 0 ? "not-allowed" : "pointer",
              transition:"background .2s",
            }}
          >{book.stock === 0 ? "Sold Out" : "Add"}</button>
        </div>
      </div>
    </div>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ book, onClose, onAddCart }) => {
  if (!book) return null;
  const disc = Math.round((1 - book.price/book.original)*100);
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16
    }} onClick={onClose}>
      <div style={{
        background:T.surface, borderRadius:20, padding:28, maxWidth:520, width:"100%",
        maxHeight:"85vh", overflowY:"auto",
        boxShadow:"0 40px 80px rgba(0,0,0,.3)"
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute", marginLeft:460, background:"none", border:"none", fontSize:20, cursor:"pointer", color:T.slate }}>✕</button>
        <div style={{ display:"flex", gap:20, marginBottom:20 }}>
          <div style={{
            width:100, height:130, background:`linear-gradient(135deg,${T.inkNavy}20,${T.parchment})`,
            borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:48, flexShrink:0
          }}>{book.img}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:T.periwinkle, fontWeight:700, letterSpacing:.8, textTransform:"uppercase", marginBottom:6 }}>
              {book.category} · {book.lang}
            </div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20, fontWeight:800, color:T.inkNavy, lineHeight:1.3, marginBottom:6 }}>
              {book.title}
            </div>
            <div style={{ fontSize:13, color:T.slate, marginBottom:8 }}>by {book.author}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
              <Stars rating={book.rating} size={14} />
              <span style={{ fontSize:12, color:T.slate }}>{book.rating} ({book.reviews} reviews)</span>
            </div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{ fontSize:26, fontWeight:800, color:T.inkNavy }}>₹{book.price}</span>
              {disc > 0 && <>
                <span style={{ fontSize:14, color:T.slateLight, textDecoration:"line-through" }}>₹{book.original}</span>
                <span style={{ fontSize:12, color:T.green, fontWeight:700 }}>Save {disc}%</span>
              </>}
            </div>
          </div>
        </div>
        <div style={{ background:T.parchment, borderRadius:12, padding:14, marginBottom:16, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[["Stock",book.stock > 0 ? `${book.stock} available` : "Out of stock"],["Publisher","Odia Sahitya"],["Language",book.lang],["Category",book.category]].map(([k,v]) => (
            <div key={k}><div style={{ fontSize:10, color:T.slate, fontWeight:600 }}>{k}</div><div style={{ fontSize:13, color:T.inkNavy, fontWeight:700 }}>{v}</div></div>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { onAddCart(book); onClose(); }} style={{
            flex:1, background:T.inkNavy, color:"#fff", border:"none", borderRadius:10, padding:"12px 0",
            fontWeight:700, fontSize:14, cursor:"pointer"
          }}>Add to Cart</button>
          <button style={{
            flex:1, background:T.goldLeaf, color:T.walnut, border:"none", borderRadius:10, padding:"12px 0",
            fontWeight:700, fontSize:14, cursor:"pointer"
          }}>Buy Now</button>
          <button style={{
            width:44, background:T.parchment, border:`1px solid ${T.border}`, borderRadius:10,
            cursor:"pointer", fontSize:18
          }}>♥</button>
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
const AdminSection = ({ activeAdmin, setActiveAdmin, books, orders }) => {
  const [editBook, setEditBook] = useState(null);
  const [newBook, setNewBook] = useState({ title:"", author:"", price:"", category:"Literature", stock:"", lang:"Odia", img:"📗" });
  const [bookList, setBookList] = useState([...books]);
  const [orderList, setOrderList] = useState([...orders]);
  const [searchQ, setSearchQ] = useState("");

  const statCards = [
    { label:"Total Books", value: bookList.length, icon:"📚", color:T.periwinkle, spark:[20,25,22,30,28,35,bookList.length] },
    { label:"Total Orders", value:"2,847", icon:"📦", color:T.goldLeaf, spark:[180,210,195,240,280,260,297] },
    { label:"Revenue", value:"₹4.8L", icon:"💰", color:T.green, spark:[42000,58000,51000,73000,89000,67000,89000] },
    { label:"Customers", value:"1,234", icon:"👥", color:"#EC4899", spark:[800,900,950,1000,1100,1180,1234] },
    { label:"Out of Stock", value: bookList.filter(b=>b.stock===0).length, icon:"⚠️", color:T.red, spark:[3,2,4,3,5,3,bookList.filter(b=>b.stock===0).length] },
    { label:"Low Stock (≤10)", value: bookList.filter(b=>b.stock>0&&b.stock<=10).length, icon:"🔔", color:"#D97706", spark:[5,4,6,5,7,5,bookList.filter(b=>b.stock>0&&b.stock<=10).length] },
  ];

  const AdminNav = () => (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:24 }}>
      {["Overview","Books","Orders","Customers","Analytics","Coupons","Authors"].map(s => (
        <button key={s} onClick={() => setActiveAdmin(s)} style={{
          padding:"7px 16px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:700, fontSize:12,
          background: activeAdmin===s ? T.inkNavy : T.parchment,
          color: activeAdmin===s ? "#fff" : T.walnut,
          transition:"all .2s"
        }}>{s}</button>
      ))}
    </div>
  );

  const filteredBooks = bookList.filter(b =>
    b.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQ.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQ.toLowerCase())
  );

  // Overview
  if (activeAdmin === "Overview") return (
    <div>
      <AdminNav />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))", gap:16, marginBottom:28 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px 20px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:11, color:T.slate, fontWeight:600, marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:24, fontWeight:800, color:T.inkNavy }}>{s.value}</div>
              <div style={{ fontSize:10, color:s.color, marginTop:4, fontWeight:700 }}>↑ +12% this month</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
              <Sparkline data={s.spark} color={s.color} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Revenue Chart */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:4 }}>Monthly Revenue</div>
          <div style={{ fontSize:11, color:T.slate, marginBottom:16 }}>Last 6 months — ₹4,80,000 total</div>
          <BarChart data={MONTHLY} height={130} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}` }}>
            <div><div style={{ fontSize:10, color:T.slate }}>Peak Month</div><div style={{ fontWeight:800, color:T.inkNavy }}>May · ₹89K</div></div>
            <div><div style={{ fontSize:10, color:T.slate }}>Avg/Month</div><div style={{ fontWeight:800, color:T.inkNavy }}>₹63,333</div></div>
            <div><div style={{ fontSize:10, color:T.slate }}>Total Orders</div><div style={{ fontWeight:800, color:T.inkNavy }}>1,266</div></div>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>Recent Orders</div>
          {orderList.slice(0,5).map(o => (
            <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:T.inkNavy }}>{o.customer}</div>
                <div style={{ fontSize:10, color:T.slate }}>{o.id} · {o.date}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <StatusBadge status={o.status} />
                <div style={{ fontSize:11, fontWeight:800, color:T.inkNavy, marginTop:3 }}>₹{o.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Books */}
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20, marginTop:20 }}>
        <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>Top Performing Books</div>
        {bookList.sort((a,b) => b.sales-a.sales).slice(0,5).map((b,i) => (
          <div key={b.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:28, height:28, background: i===0 ? T.goldLeaf : i===1 ? T.slateLight : T.parchment, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color: i<2 ? "#fff" : T.walnut, flexShrink:0 }}>{i+1}</div>
            <span style={{ fontSize:22 }}>{b.img}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:13, fontWeight:700, color:T.inkNavy }}>{b.title}</div>
              <div style={{ fontSize:11, color:T.slate }}>{b.author}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontWeight:800, color:T.inkNavy, fontSize:13 }}>{b.sales.toLocaleString()} sold</div>
              <div style={{ fontSize:10, color:T.slate }}>{b.views.toLocaleString()} views</div>
            </div>
            <div style={{ width:60, textAlign:"right" }}>
              <div style={{ background:T.parchment, height:6, borderRadius:3, overflow:"hidden" }}>
                <div style={{ background:`linear-gradient(90deg,${T.periwinkle},${T.inkNavy})`, width:`${(b.sales/1240)*100}%`, height:"100%" }} />
              </div>
              <div style={{ fontSize:10, color:T.periwinkle, fontWeight:700, marginTop:2 }}>{Math.round((b.sales/1240)*100)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Books Management
  if (activeAdmin === "Books") return (
    <div>
      <AdminNav />
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <input
          value={searchQ} onChange={e => setSearchQ(e.target.value)}
          placeholder="Search books, authors, categories..."
          style={{ flex:1, minWidth:220, padding:"9px 14px", borderRadius:10, border:`1px solid ${T.border}`, fontSize:13, background:T.surface, color:T.inkNavy, outline:"none" }}
        />
        <button onClick={() => setEditBook({ id:"new", ...newBook })} style={{ background:T.inkNavy, color:"#fff", border:"none", borderRadius:10, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          + Add Book
        </button>
        <button style={{ background:T.parchment, color:T.walnut, border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          📤 CSV Upload
        </button>
      </div>

      {/* Add/Edit Form */}
      {editBook && (
        <div style={{ background:T.parchment, border:`1px solid ${T.goldLeaf}`, borderRadius:16, padding:20, marginBottom:20 }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>
            {editBook.id === "new" ? "Add New Book" : `Edit: ${editBook.title}`}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            {[["title","Book Title"],["author","Author"],["price","Price (₹)"],["stock","Stock Qty"]].map(([k,l]) => (
              <div key={k}>
                <label style={{ fontSize:11, color:T.slate, fontWeight:600, display:"block", marginBottom:4 }}>{l}</label>
                <input
                  value={editBook[k] || ""}
                  onChange={e => setEditBook(p => ({...p,[k]:e.target.value}))}
                  style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, background:T.surface, boxSizing:"border-box" }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize:11, color:T.slate, fontWeight:600, display:"block", marginBottom:4 }}>Category</label>
              <select value={editBook.category} onChange={e => setEditBook(p => ({...p,category:e.target.value}))}
                style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, background:T.surface }}>
                {CATS.filter(c=>c!=="All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, color:T.slate, fontWeight:600, display:"block", marginBottom:4 }}>Language</label>
              <select value={editBook.lang} onChange={e => setEditBook(p => ({...p,lang:e.target.value}))}
                style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, background:T.surface }}>
                {["Odia","English","Hindi"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => {
              if (editBook.id === "new") {
                setBookList(p => [...p, { ...editBook, id: Date.now(), original: editBook.price, rating:0, reviews:0, sales:0, views:0, badge:"New", price: Number(editBook.price), stock: Number(editBook.stock) }]);
              } else {
                setBookList(p => p.map(b => b.id === editBook.id ? { ...b, ...editBook } : b));
              }
              setEditBook(null);
            }} style={{ background:T.inkNavy, color:"#fff", border:"none", borderRadius:8, padding:"9px 20px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              {editBook.id === "new" ? "Add Book" : "Save Changes"}
            </button>
            <button onClick={() => setEditBook(null)} style={{ background:"none", color:T.slate, border:`1px solid ${T.border}`, borderRadius:8, padding:"9px 20px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Books Table */}
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 80px 80px 80px 100px", gap:0, padding:"10px 16px", background:T.parchment, fontSize:10, fontWeight:700, color:T.slate, letterSpacing:.5, textTransform:"uppercase", borderBottom:`1px solid ${T.border}` }}>
          {["Book","Author","Category","Price","Stock","Rating","Actions"].map(h => <div key={h}>{h}</div>)}
        </div>
        {filteredBooks.map(b => (
          <div key={b.id} style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 80px 80px 80px 100px", gap:0, padding:"12px 16px", borderBottom:`1px solid ${T.border}`, alignItems:"center", transition:"background .15s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>{b.img}</span>
              <div>
                <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:12, fontWeight:700, color:T.inkNavy, lineHeight:1.3 }}>{b.title}</div>
                <div style={{ fontSize:10, color:T.periwinkle }}>{b.badge}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:T.slate }}>{b.author}</div>
            <div style={{ fontSize:11, color:T.walnut, background:T.parchment, padding:"2px 8px", borderRadius:20, display:"inline-block" }}>{b.category}</div>
            <div style={{ fontWeight:700, fontSize:13, color:T.inkNavy }}>₹{b.price}</div>
            <div>
              <span style={{ fontWeight:700, fontSize:13, color: b.stock === 0 ? T.red : b.stock <= 10 ? "#D97706" : T.green }}>{b.stock}</span>
              <div style={{ fontSize:9, color:T.slate }}>{b.stock === 0 ? "Out" : b.stock <= 10 ? "Low" : "OK"}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:2 }}>
              <span style={{ color:T.goldLeaf, fontSize:11 }}>★</span>
              <span style={{ fontSize:12, fontWeight:700, color:T.inkNavy }}>{b.rating}</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={() => setEditBook(b)} style={{ background:T.periwinkle+"20", color:T.periwinkle, border:"none", borderRadius:6, padding:"4px 8px", fontSize:10, fontWeight:700, cursor:"pointer" }}>Edit</button>
              <button onClick={() => setBookList(p => p.filter(x => x.id !== b.id))} style={{ background:T.red+"15", color:T.red, border:"none", borderRadius:6, padding:"4px 8px", fontSize:10, fontWeight:700, cursor:"pointer" }}>Del</button>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div style={{ textAlign:"center", padding:40, color:T.slate }}>No books found for "{searchQ}"</div>
        )}
      </div>
    </div>
  );

  // Orders
  if (activeAdmin === "Orders") return (
    <div>
      <AdminNav />
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {["All","Pending","Processing","Shipped","Delivered","Cancelled"].map(s => (
          <button key={s} style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${T.border}`, background:s==="All"?T.inkNavy:T.surface, color:s==="All"?"#fff":T.slate, fontSize:12, fontWeight:600, cursor:"pointer" }}>{s}</button>
        ))}
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr 2fr 80px 100px 80px", padding:"10px 16px", background:T.parchment, fontSize:10, fontWeight:700, color:T.slate, letterSpacing:.5, textTransform:"uppercase", borderBottom:`1px solid ${T.border}` }}>
          {["Order ID","Customer","Book","Amount","Status","Action"].map(h => <div key={h}>{h}</div>)}
        </div>
        {orderList.map(o => (
          <div key={o.id} style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr 2fr 80px 100px 80px", padding:"12px 16px", borderBottom:`1px solid ${T.border}`, alignItems:"center" }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.periwinkle }}>{o.id}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:T.inkNavy }}>{o.customer}</div>
              <div style={{ fontSize:10, color:T.slate }}>{o.date}</div>
            </div>
            <div style={{ fontSize:12, color:T.walnut, display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{o.book}</div>
            <div style={{ fontWeight:800, color:T.inkNavy, fontSize:13 }}>₹{o.amount}</div>
            <div>
              <select
                value={o.status}
                onChange={e => setOrderList(p => p.map(x => x.id===o.id ? {...x,status:e.target.value} : x))}
                style={{ padding:"4px 6px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:11, background:T.surface, cursor:"pointer" }}
              >
                {["Pending","Processing","Shipped","Delivered","Cancelled","Returned"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button style={{ background:T.parchment, border:`1px solid ${T.border}`, borderRadius:6, padding:"4px 8px", fontSize:10, fontWeight:700, cursor:"pointer", color:T.walnut }}>Invoice</button>
          </div>
        ))}
      </div>
    </div>
  );

  // Analytics
  if (activeAdmin === "Analytics") return (
    <div>
      <AdminNav />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:4 }}>Revenue Trend</div>
          <div style={{ fontSize:11, color:T.slate, marginBottom:16 }}>6-month revenue breakdown</div>
          <BarChart data={MONTHLY} height={140} />
        </div>
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>Category Distribution</div>
          {CATS.filter(c=>c!=="All").map((c,i) => {
            const count = bookList.filter(b=>b.category===c).length;
            const pct = Math.round((count/bookList.length)*100) || 0;
            const colors = [T.periwinkle,T.goldLeaf,"#EC4899",T.green,"#F59E0B","#06B6D4","#8B5CF6","#EF4444"];
            return (
              <div key={c} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:T.inkNavy }}>{c}</span>
                  <span style={{ fontSize:11, color:T.slate }}>{count} books · {pct}%</span>
                </div>
                <div style={{ background:T.parchment, height:6, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ background:colors[i%colors.length], width:`${pct||5}%`, height:"100%", transition:"width .5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20 }}>
        <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>Key Metrics</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {[
            { label:"Conversion Rate", value:"3.8%", delta:"+0.5%", color:T.green },
            { label:"Avg Order Value", value:"₹387", delta:"+₹23", color:T.periwinkle },
            { label:"Return Rate", value:"1.2%", delta:"-0.3%", color:T.green },
            { label:"Customer LTV", value:"₹2,140", delta:"+₹180", color:T.goldLeaf },
          ].map(m => (
            <div key={m.label} style={{ background:T.parchment, borderRadius:12, padding:16, textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:800, color:T.inkNavy }}>{m.value}</div>
              <div style={{ fontSize:11, color:T.slate, marginTop:2 }}>{m.label}</div>
              <div style={{ fontSize:11, color:m.color, fontWeight:700, marginTop:4 }}>{m.delta} vs last month</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Coupons
  if (activeAdmin === "Coupons") return (
    <div>
      <AdminNav />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>Create Coupon</div>
          {[["Code","ODIA20"],["Discount","20"],["Min Order","299"],["Usage Limit","100"]].map(([l,p]) => (
            <div key={l} style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, color:T.slate, fontWeight:600, display:"block", marginBottom:4 }}>{l}</label>
              <input placeholder={p} style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, background:T.parchment, boxSizing:"border-box" }} />
            </div>
          ))}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, color:T.slate, fontWeight:600, display:"block", marginBottom:4 }}>Type</label>
            <select style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, background:T.parchment }}>
              <option>Percentage</option><option>Fixed Amount</option>
            </select>
          </div>
          <button style={{ width:"100%", background:T.inkNavy, color:"#fff", border:"none", borderRadius:10, padding:"11px", fontWeight:700, fontSize:14, cursor:"pointer" }}>Create Coupon</button>
        </div>
        <div>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>Active Coupons</div>
          {[
            { code:"WELCOME10", type:"10%", uses:45, limit:100, exp:"Jul 31, 2026" },
            { code:"ODIA50", type:"₹50 off", uses:123, limit:200, exp:"Jun 30, 2026" },
            { code:"FEST2026", type:"20%", uses:67, limit:150, exp:"Aug 15, 2026" },
          ].map(c => (
            <div key={c.code} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:800, fontSize:15, color:T.inkNavy, letterSpacing:1 }}>{c.code}</div>
                <div style={{ fontSize:11, color:T.slate }}>{c.type} · Expires {c.exp}</div>
                <div style={{ fontSize:11, color:T.periwinkle, marginTop:3, fontWeight:600 }}>Used {c.uses}/{c.limit} times</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ background:T.parchment, borderRadius:8, padding:"4px 8px", marginBottom:4 }}>
                  <div style={{ background:T.periwinkle, height:4, borderRadius:2, width:`${(c.uses/c.limit)*100}%` }} />
                </div>
                <button style={{ background:T.red+"15", color:T.red, border:"none", borderRadius:6, padding:"4px 10px", fontSize:10, fontWeight:700, cursor:"pointer" }}>Disable</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Authors
  if (activeAdmin === "Authors") return (
    <div>
      <AdminNav />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
        {AUTHORS.map(a => (
          <div key={a.id} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:10 }}>{a.img}</div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:4 }}>{a.name}</div>
            <div style={{ fontSize:11, color:T.slate, marginBottom:4 }}>{a.bio}</div>
            <div style={{ fontSize:11, color:T.periwinkle, fontWeight:600, marginBottom:12 }}>{a.specialty}</div>
            <div style={{ display:"flex", justifyContent:"center", gap:10 }}>
              <span style={{ background:T.parchment, borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, color:T.walnut }}>{a.books} books</span>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button style={{ flex:1, background:T.parchment, border:`1px solid ${T.border}`, borderRadius:8, padding:"6px", fontSize:11, fontWeight:700, cursor:"pointer", color:T.walnut }}>Edit</button>
              <button style={{ flex:1, background:T.red+"15", border:"none", borderRadius:8, padding:"6px", fontSize:11, fontWeight:700, cursor:"pointer", color:T.red }}>Remove</button>
            </div>
          </div>
        ))}
        <div style={{ background:`${T.inkNavy}08`, border:`2px dashed ${T.border}`, borderRadius:16, padding:20, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", minHeight:200 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>➕</div>
          <div style={{ fontWeight:700, color:T.slate, fontSize:13 }}>Add Author</div>
        </div>
      </div>
    </div>
  );

  // Customers
  return (
    <div>
      <AdminNav />
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:16, borderBottom:`1px solid ${T.border}`, display:"flex", gap:10 }}>
          <input placeholder="Search customers..." style={{ flex:1, padding:"8px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, background:T.parchment }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 80px 80px 100px", padding:"10px 16px", background:T.parchment, fontSize:10, fontWeight:700, color:T.slate, letterSpacing:.5, textTransform:"uppercase", borderBottom:`1px solid ${T.border}` }}>
          {["Customer","Email","Orders","Spent","Status"].map(h => <div key={h}>{h}</div>)}
        </div>
        {[
          { name:"Rahul Mohanty", email:"rahul@email.com", orders:12, spent:4280, status:"VIP" },
          { name:"Priya Nayak", email:"priya@email.com", orders:7, spent:2190, status:"Regular" },
          { name:"Suresh Panda", email:"suresh@email.com", orders:3, spent:897, status:"New" },
          { name:"Anita Behera", email:"anita@email.com", orders:18, spent:6340, status:"VIP" },
          { name:"Bikash Sahu", email:"bikash@email.com", orders:1, spent:399, status:"New" },
        ].map(c => (
          <div key={c.name} style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 80px 80px 100px", padding:"12px 16px", borderBottom:`1px solid ${T.border}`, alignItems:"center" }}>
            <div style={{ fontWeight:700, color:T.inkNavy, fontSize:13 }}>{c.name}</div>
            <div style={{ fontSize:12, color:T.slate }}>{c.email}</div>
            <div style={{ fontWeight:700, color:T.inkNavy, fontSize:13 }}>{c.orders}</div>
            <div style={{ fontWeight:700, color:T.inkNavy, fontSize:13 }}>₹{c.spent.toLocaleString()}</div>
            <span style={{
              background: c.status==="VIP" ? T.goldLeaf+"30" : c.status==="New" ? T.periwinkle+"20" : T.parchment,
              color: c.status==="VIP" ? "#7A5C00" : c.status==="New" ? T.periwinkle : T.walnut,
              padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700
            }}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
const CartDrawer = ({ cart, open, onClose, onRemove, onUpdateQty }) => (
  <div style={{
    position:"fixed", right: open ? 0 : "-100%", top:0, bottom:0,
    width: Math.min(380, window.innerWidth),
    background:T.surface, zIndex:150, transition:"right .3s ease",
    boxShadow:"-10px 0 40px rgba(0,0,0,.15)", display:"flex", flexDirection:"column"
  }}>
    <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20, fontWeight:800, color:T.inkNavy }}>
        Cart <span style={{ color:T.slate, fontSize:14 }}>({cart.length} items)</span>
      </div>
      <button onClick={onClose} style={{ background:T.parchment, border:"none", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:16 }}>✕</button>
    </div>
    <div style={{ flex:1, overflowY:"auto", padding:16 }}>
      {cart.length === 0 ? (
        <div style={{ textAlign:"center", padding:48, color:T.slateLight }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🛒</div>
          <div style={{ fontWeight:700, marginBottom:4 }}>Your cart is empty</div>
          <div style={{ fontSize:13 }}>Add some books to get started</div>
        </div>
      ) : cart.map(item => (
        <div key={item.id} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ width:50, height:60, background:T.parchment, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{item.img}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:12, fontWeight:700, color:T.inkNavy, lineHeight:1.3, marginBottom:2 }}>{item.title}</div>
            <div style={{ fontSize:11, color:T.slate, marginBottom:6 }}>{item.author}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => onUpdateQty(item.id, (item.qty||1)-1)} style={{ width:22, height:22, background:T.parchment, border:`1px solid ${T.border}`, borderRadius:4, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                <span style={{ fontWeight:700, minWidth:16, textAlign:"center", fontSize:13 }}>{item.qty||1}</span>
                <button onClick={() => onUpdateQty(item.id, (item.qty||1)+1)} style={{ width:22, height:22, background:T.parchment, border:`1px solid ${T.border}`, borderRadius:4, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
              </div>
              <span style={{ fontWeight:800, color:T.inkNavy }}>₹{item.price * (item.qty||1)}</span>
            </div>
          </div>
          <button onClick={() => onRemove(item.id)} style={{ background:"none", border:"none", color:T.red, cursor:"pointer", fontSize:16, alignSelf:"flex-start" }}>✕</button>
        </div>
      ))}
    </div>
    {cart.length > 0 && (
      <div style={{ padding:16, borderTop:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <span style={{ fontWeight:700, color:T.slate }}>Subtotal</span>
          <span style={{ fontWeight:800, fontSize:18, color:T.inkNavy }}>₹{cart.reduce((s,i) => s + i.price*(i.qty||1), 0)}</span>
        </div>
        <button style={{ width:"100%", background:`linear-gradient(135deg,${T.inkNavy},${T.periwinkle})`, color:"#fff", border:"none", borderRadius:12, padding:"14px", fontWeight:800, fontSize:15, cursor:"pointer" }}>
          Proceed to Checkout
        </button>
        <div style={{ textAlign:"center", marginTop:8, fontSize:11, color:T.slate }}>Free delivery on orders above ₹499 · COD available</div>
      </div>
    )}
  </div>
);

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
const Hero = ({ onShop }) => {
  const [slide, setSlide] = useState(0);
  const slides = [
    { title:"ଓଡ଼ିଆ ସଂସ୍କୃତି", sub:"Celebrate Odia Literature", desc:"Discover the rich world of Odia storytelling — from timeless classics to contemporary voices shaping modern literature.", cta:"Explore Literature", emoji:"📖", accent:T.periwinkle },
    { title:"New Arrivals", sub:"Fresh Off the Press", desc:"The latest Odia books, magazines, and digital publications — curated for readers who never stop exploring.", cta:"See New Arrivals", emoji:"✨", accent:T.goldLeaf },
    { title:"Award Winners", sub:"Padma to Sahitya Akademi", desc:"Books by India's most celebrated Odia authors — Pratibha Ray, Manoj Das, Fakir Mohan Senapati, and more.", cta:"Browse Collection", emoji:"🏆", accent:"#EC4899" },
  ];
  useEffect(() => { const t = setInterval(() => setSlide(p => (p+1)%3), 4500); return () => clearInterval(t); }, []);
  const s = slides[slide];

  return (
    <div style={{
      background:`linear-gradient(135deg, ${T.inkNavy} 0%, #2D3561 50%, ${T.inkNavy}EE 100%)`,
      minHeight:460, display:"flex", alignItems:"center", justifyContent:"center",
      padding:"60px 24px", position:"relative", overflow:"hidden"
    }}>
      {/* bg texture */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 80% 50%, ${s.accent}18 0%, transparent 60%)`, transition:"background .8s ease" }} />
      {[...Array(6)].map((_,i) => (
        <div key={i} style={{
          position:"absolute", fontSize:24, opacity:.06, color:"#fff",
          top:`${10+i*15}%`, left:`${5+i*14}%`,
          animation:`float${i} ${3+i}s ease-in-out infinite alternate`,
          transform:`rotate(${-15+i*7}deg)`
        }}>📚</div>
      ))}
      <div style={{ maxWidth:760, width:"100%", textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${s.accent}25`, border:`1px solid ${s.accent}50`, borderRadius:24, padding:"6px 16px", marginBottom:20 }}>
          <span>{s.emoji}</span>
          <span style={{ color:s.accent, fontSize:12, fontWeight:700, letterSpacing:.8 }}>{s.sub}</span>
        </div>
        <h1 style={{
          fontFamily:"'Playfair Display',Georgia,serif",
          fontSize:"clamp(36px,6vw,68px)", fontWeight:900, color:"#fff",
          lineHeight:1.1, margin:"0 0 18px", letterSpacing:"-1px",
          transition:"all .5s ease"
        }}>{s.title}</h1>
        <p style={{ color:"rgba(255,255,255,.7)", fontSize:"clamp(14px,2vw,17px)", lineHeight:1.7, maxWidth:520, margin:"0 auto 32px" }}>{s.desc}</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={onShop} style={{
            background:`linear-gradient(135deg,${s.accent},${s.accent}CC)`,
            color: slide===0 ? "#fff" : T.walnut,
            border:"none", borderRadius:12, padding:"14px 32px",
            fontWeight:800, fontSize:15, cursor:"pointer",
            boxShadow:`0 8px 24px ${s.accent}50`
          }}>{s.cta}</button>
          <button style={{ background:"rgba(255,255,255,.1)", color:"#fff", border:"1px solid rgba(255,255,255,.25)", borderRadius:12, padding:"14px 32px", fontWeight:700, fontSize:15, cursor:"pointer", backdropFilter:"blur(8px)" }}>
            View Bestsellers
          </button>
        </div>
        {/* Slide dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:28 }}>
          {slides.map((_,i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: i===slide?24:8, height:8, borderRadius:4, border:"none", background: i===slide ? s.accent : "rgba(255,255,255,.3)", cursor:"pointer", transition:"all .3s ease" }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home"); // home | shop | admin | account
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeAdmin, setActiveAdmin] = useState("Overview");
  const [searchQ, setSearchQ] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterLang, setFilterLang] = useState("All");
  const [sortBy, setSortBy] = useState("Best Selling");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  const showToast = (msg, color=T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (book) => {
    if (book.stock === 0) return showToast("Out of stock", T.red);
    setCart(p => {
      const ex = p.find(b => b.id === book.id);
      if (ex) return p.map(b => b.id === book.id ? {...b, qty:(b.qty||1)+1} : b);
      return [...p, {...book, qty:1}];
    });
    showToast(`"${book.title}" added to cart`);
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCart(p => p.filter(b => b.id !== id));
  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(p => p.map(b => b.id === id ? {...b, qty} : b));
  };

  const toggleWishlist = (id) => {
    setWishlist(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
    showToast(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist", T.periwinkle);
  };

  // Filtered/sorted books
  const filteredBooks = BOOKS
    .filter(b => {
      if (filterCat !== "All" && b.category !== filterCat) return false;
      if (filterLang !== "All" && b.lang !== filterLang) return false;
      if (b.price < priceRange[0] || b.price > priceRange[1]) return false;
      if (searchQ && !b.title.toLowerCase().includes(searchQ.toLowerCase()) &&
          !b.author.toLowerCase().includes(searchQ.toLowerCase())) return false;
      return true;
    })
    .sort((a,b) => {
      if (sortBy === "Price Low to High") return a.price - b.price;
      if (sortBy === "Price High to Low") return b.price - a.price;
      if (sortBy === "Highest Rated") return b.rating - a.rating;
      if (sortBy === "Newest") return b.id - a.id;
      return b.sales - a.sales;
    });

  const cartCount = cart.reduce((s,i) => s + (i.qty||1), 0);

  // ─ NAV
  const Nav = () => (
    <nav style={{
      background:T.surface, borderBottom:`1px solid ${T.border}`,
      padding:"0 24px", height:60,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      position:"sticky", top:0, zIndex:100,
      boxShadow:"0 2px 20px rgba(0,0,0,.06)"
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => setView("home")}>
        <span style={{ fontSize:22 }}>📚</span>
        <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:900, fontSize:18, color:T.inkNavy }}>
          Nimapada<span style={{ color:T.goldLeaf }}>BookMart</span>
        </span>
      </div>
      <div style={{ display:"flex", alignItems:"center", background:T.parchment, borderRadius:24, padding:"6px 16px", gap:8, flex:1, maxWidth:340, margin:"0 20px" }}>
        <span style={{ color:T.slate, fontSize:14 }}>🔍</span>
        <input
          value={searchQ}
          onChange={e => { setSearchQ(e.target.value); if(view!=="shop") setView("shop"); }}
          placeholder="Search books, authors..."
          style={{ border:"none", background:"none", outline:"none", fontSize:13, color:T.inkNavy, flex:1, minWidth:0 }}
        />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        {[
          { label:"Home", key:"home", icon:"🏠" },
          { label:"Shop", key:"shop", icon:"🏪" },
          { label:"Account", key:"account", icon:"👤" },
          { label:"Admin", key:"admin", icon:"⚙️" },
        ].map(n => (
          <button key={n.key} onClick={() => setView(n.key)} style={{
            background: view===n.key ? T.inkNavy : "none",
            color: view===n.key ? "#fff" : T.slate,
            border:"none", borderRadius:8, padding:"6px 12px",
            fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4,
            transition:"all .2s"
          }}>
            <span>{n.icon}</span>
            <span style={{ display:"none", }}>{n.label}</span>
          </button>
        ))}
        <button onClick={() => setCartOpen(true)} style={{
          background: cartCount > 0 ? T.inkNavy : T.parchment,
          color: cartCount > 0 ? "#fff" : T.walnut,
          border:"none", borderRadius:10, padding:"7px 14px",
          fontSize:13, fontWeight:800, cursor:"pointer",
          display:"flex", alignItems:"center", gap:6,
          transition:"all .2s", marginLeft:4
        }}>
          🛒 {cartCount > 0 && <span style={{ background:T.goldLeaf, color:T.walnut, borderRadius:10, padding:"1px 6px", fontSize:11 }}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );

  // ─ HOME
  const HomePage = () => (
    <div>
      <Hero onShop={() => setView("shop")} />

      {/* Categories Row */}
      <div style={{ background:T.parchment, padding:"28px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontWeight:800, color:T.inkNavy, marginBottom:4, textAlign:"center" }}>Browse by Category</div>
          <div style={{ fontSize:13, color:T.slate, textAlign:"center", marginBottom:20 }}>Eight curated collections of Odia publishing</div>
          <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { cat:"Literature", icon:"📜", color:"#1B1F3B" },
              { cat:"Fiction", icon:"🌊", color:"#2D3561" },
              { cat:"Autobiography", icon:"✍️", color:"#8B5CF6" },
              { cat:"Poetry", icon:"🌺", color:"#EC4899" },
              { cat:"Children", icon:"🎨", color:"#F59E0B" },
              { cat:"Academic", icon:"🔢", color:"#06B6D4" },
              { cat:"Religious", icon:"🏛️", color:"#16A34A" },
              { cat:"Self Help", icon:"💡", color:"#EA580C" },
            ].map(c => (
              <button key={c.cat} onClick={() => { setFilterCat(c.cat); setView("shop"); }} style={{
                background:T.surface, border:`1px solid ${T.border}`, borderRadius:14,
                padding:"10px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                transition:"all .2s", fontWeight:700, fontSize:13, color:T.walnut,
                boxShadow:"0 2px 8px rgba(0,0,0,.04)"
              }}>
                <span>{c.icon}</span>{c.cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bestsellers */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:11, color:T.goldLeaf, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Hand-Picked</div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, fontWeight:900, color:T.inkNavy }}>Bestsellers</div>
          </div>
          <button onClick={() => setView("shop")} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer", color:T.walnut }}>View All →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:18 }}>
          {BOOKS.sort((a,b) => b.sales-a.sales).slice(0,4).map(b => (
            <BookCard key={b.id} book={b} onAddCart={addToCart} onView={setSelectedBook} />
          ))}
        </div>
      </div>

      {/* Featured Authors */}
      <div style={{ background:T.inkNavy, padding:"40px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:11, color:T.goldLeaf, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>The Masters</div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, fontWeight:900, color:"#fff" }}>Featured Authors</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
            {AUTHORS.map(a => (
              <div key={a.id} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:16, padding:20, textAlign:"center", cursor:"pointer", transition:"all .2s" }}>
                <div style={{ fontSize:44, marginBottom:10 }}>{a.img}</div>
                <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, color:"#fff", fontSize:15, marginBottom:3 }}>{a.name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginBottom:6 }}>{a.bio}</div>
                <div style={{ fontSize:11, color:T.goldLeaf, fontWeight:700 }}>{a.books} books published</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:11, color:T.periwinkle, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Just Published</div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, fontWeight:900, color:T.inkNavy }}>New Arrivals</div>
          </div>
          <button onClick={() => { setSortBy("Newest"); setView("shop"); }} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer", color:T.walnut }}>See All →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:18 }}>
          {BOOKS.sort((a,b) => b.id-a.id).slice(0,4).map(b => (
            <BookCard key={b.id} book={b} onAddCart={addToCart} onView={setSelectedBook} compact />
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background:T.parchment, padding:"40px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:11, color:T.goldLeaf, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Readers Say</div>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, fontWeight:900, color:T.inkNavy, marginBottom:28 }}>Trusted by 1,200+ readers across Odisha</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
            {[
              { name:"Subhashree Mohanty", loc:"Bhubaneswar", text:"Finally, a platform that takes Odia literature seriously. The collection is incredible.", rating:5 },
              { name:"Ajit Kumar Panda", loc:"Cuttack", text:"Delivery was fast and the packaging was perfect. My copy arrived in pristine condition.", rating:5 },
              { name:"Lipsa Pradhan", loc:"Rourkela", text:"I discovered so many authors I never knew existed. This site is a treasure for Odia readers.", rating:4 },
            ].map(t => (
              <div key={t.name} style={{ background:T.surface, borderRadius:16, padding:20, textAlign:"left", border:`1px solid ${T.border}` }}>
                <Stars rating={t.rating} size={14} />
                <p style={{ fontSize:13, color:T.walnut, lineHeight:1.7, margin:"10px 0 14px", fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ fontSize:12, fontWeight:700, color:T.inkNavy }}>{t.name}</div>
                <div style={{ fontSize:11, color:T.slate }}>{t.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ background:`linear-gradient(135deg,${T.periwinkle},${T.inkNavy})`, padding:"40px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:500, margin:"0 auto" }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:28, fontWeight:900, color:"#fff", marginBottom:8 }}>Stay in the story</div>
          <div style={{ color:"rgba(255,255,255,.7)", fontSize:14, marginBottom:24 }}>New arrivals, author spotlights, and exclusive discounts from NimapadaBookMart — straight to your inbox.</div>
          <div style={{ display:"flex", gap:10 }}>
            <input placeholder="Enter your email" style={{ flex:1, padding:"12px 16px", borderRadius:10, border:"none", fontSize:14, outline:"none" }} />
            <button style={{ background:T.goldLeaf, color:T.walnut, border:"none", borderRadius:10, padding:"12px 20px", fontWeight:800, fontSize:14, cursor:"pointer" }}>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background:T.walnut, color:"rgba(255,255,255,.6)", padding:"28px 24px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Playfair Display',Georgia,serif", color:"#fff", fontWeight:800, fontSize:16, marginBottom:6 }}>📚 NimapadaBookMart</div>
        <div style={{ fontSize:12 }}>© 2026 NimapadaBookMart · nimapadabookmart.com · Nimapada, Odisha</div>
      </footer>
    </div>
  );

  // ─ SHOP PAGE
  const ShopPage = () => (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>
      <div style={{ display:"flex", gap:20 }}>
        {/* Filters Sidebar */}
        <div style={{ width:220, flexShrink:0 }}>
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:18, position:"sticky", top:80 }}>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>Filters</div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.slate, letterSpacing:.6, textTransform:"uppercase", marginBottom:10 }}>Category</div>
              {CATS.map(c => (
                <label key={c} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7, cursor:"pointer" }}>
                  <input type="radio" checked={filterCat===c} onChange={() => setFilterCat(c)} style={{ accentColor:T.inkNavy }} />
                  <span style={{ fontSize:13, color: filterCat===c ? T.inkNavy : T.slate, fontWeight: filterCat===c ? 700 : 400 }}>{c}</span>
                  <span style={{ marginLeft:"auto", fontSize:11, color:T.slateLight }}>
                    {c === "All" ? BOOKS.length : BOOKS.filter(b=>b.category===c).length}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.slate, letterSpacing:.6, textTransform:"uppercase", marginBottom:10 }}>Language</div>
              {["All","Odia","English","Hindi"].map(l => (
                <label key={l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7, cursor:"pointer" }}>
                  <input type="radio" checked={filterLang===l} onChange={() => setFilterLang(l)} style={{ accentColor:T.inkNavy }} />
                  <span style={{ fontSize:13, color: filterLang===l ? T.inkNavy : T.slate, fontWeight: filterLang===l ? 700 : 400 }}>{l}</span>
                </label>
              ))}
            </div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.slate, letterSpacing:.6, textTransform:"uppercase", marginBottom:10 }}>
                Price Range · ₹{priceRange[0]}–₹{priceRange[1]}
              </div>
              <input type="range" min={0} max={1000} value={priceRange[1]} onChange={e => setPriceRange([0,+e.target.value])}
                style={{ width:"100%", accentColor:T.inkNavy }} />
            </div>

            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.slate, letterSpacing:.6, textTransform:"uppercase", marginBottom:10 }}>Availability</div>
              <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7, cursor:"pointer", fontSize:13, color:T.slate }}>
                <input type="checkbox" style={{ accentColor:T.inkNavy }} /> In Stock Only
              </label>
            </div>

            <button onClick={() => { setFilterCat("All"); setFilterLang("All"); setPriceRange([0,1000]); setSearchQ(""); }}
              style={{ width:"100%", background:T.parchment, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px", fontSize:12, fontWeight:700, cursor:"pointer", color:T.walnut, marginTop:16 }}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Book Grid */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20, fontWeight:800, color:T.inkNavy }}>
              {filteredBooks.length} books found
              {filterCat !== "All" && <span style={{ fontSize:14, color:T.slate, fontWeight:400 }}> in {filterCat}</span>}
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, background:T.surface, color:T.inkNavy, cursor:"pointer" }}>
                {["Best Selling","Newest","Price Low to High","Price High to Low","Highest Rated"].map(s => <option key={s}>{s}</option>)}
              </select>
              <div style={{ display:"flex", background:T.parchment, borderRadius:8, overflow:"hidden", border:`1px solid ${T.border}` }}>
                {["grid","list"].map(m => (
                  <button key={m} onClick={() => setViewMode(m)} style={{
                    padding:"7px 12px", border:"none", cursor:"pointer", fontSize:14,
                    background: viewMode===m ? T.inkNavy : "none",
                    color: viewMode===m ? "#fff" : T.slate
                  }}>{m === "grid" ? "⊞" : "☰"}</button>
                ))}
              </div>
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div style={{ textAlign:"center", padding:60, color:T.slateLight }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>No books found</div>
              <div style={{ fontSize:13 }}>Try adjusting your filters</div>
            </div>
          ) : viewMode === "grid" ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:16 }}>
              {filteredBooks.map(b => (
                <BookCard key={b.id} book={b} onAddCart={addToCart} onView={setSelectedBook} />
              ))}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {filteredBooks.map(b => (
                <div key={b.id} onClick={() => setSelectedBook(b)} style={{
                  background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:16,
                  display:"flex", gap:16, cursor:"pointer", transition:"all .2s",
                }}>
                  <div style={{ width:70, height:85, background:`linear-gradient(135deg,${T.inkNavy}15,${T.parchment})`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, flexShrink:0 }}>{b.img}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:800, color:T.inkNavy, marginBottom:3 }}>{b.title}</div>
                    <div style={{ fontSize:12, color:T.slate, marginBottom:6 }}>{b.author} · {b.category} · {b.lang}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                      <Stars rating={b.rating} size={12} />
                      <span style={{ fontSize:11, color:T.slate }}>({b.reviews})</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <span style={{ fontWeight:800, fontSize:18, color:T.inkNavy }}>₹{b.price}</span>
                        {b.original !== b.price && <span style={{ fontSize:12, color:T.slateLight, textDecoration:"line-through", marginLeft:6 }}>₹{b.original}</span>}
                      </div>
                      <button onClick={e => { e.stopPropagation(); addToCart(b); }} style={{ background:T.inkNavy, color:"#fff", border:"none", borderRadius:8, padding:"7px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ─ ADMIN PAGE
  const AdminPage = () => {
    if (!adminAuthed) return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:500, padding:24 }}>
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, padding:36, maxWidth:380, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:24, fontWeight:900, color:T.inkNavy, marginBottom:6 }}>Admin Access</div>
          <div style={{ fontSize:13, color:T.slate, marginBottom:24 }}>Enter admin credentials to access the dashboard</div>
          <input type="password" placeholder="Password (try: admin)" value={adminPass} onChange={e => setAdminPass(e.target.value)}
            onKeyDown={e => e.key==="Enter" && (adminPass==="admin" ? setAdminAuthed(true) : showToast("Wrong password", T.red))}
            style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:`1px solid ${T.border}`, fontSize:14, marginBottom:14, boxSizing:"border-box", outline:"none" }} />
          <button onClick={() => adminPass==="admin" ? setAdminAuthed(true) : showToast("Try 'admin'", T.red)} style={{
            width:"100%", background:T.inkNavy, color:"#fff", border:"none", borderRadius:10, padding:"13px", fontWeight:800, fontSize:15, cursor:"pointer"
          }}>Enter Dashboard</button>
          <div style={{ marginTop:12, fontSize:11, color:T.slateLight }}>Demo password: admin</div>
        </div>
      </div>
    );

    return (
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:28, fontWeight:900, color:T.inkNavy }}>Admin Dashboard</div>
            <div style={{ fontSize:13, color:T.slate }}>NimapadaBookMart · Management Console · Tue, Jun 16 2026</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button style={{ background:T.parchment, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", color:T.walnut }}>
              📥 Export Report
            </button>
            <button onClick={() => setAdminAuthed(false)} style={{ background:T.red+"15", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", color:T.red }}>
              Logout
            </button>
          </div>
        </div>
        <AdminSection activeAdmin={activeAdmin} setActiveAdmin={setActiveAdmin} books={BOOKS} orders={ORDERS} />
      </div>
    );
  };

  // ─ ACCOUNT PAGE
  const AccountPage = () => (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 20px" }}>
      <div style={{ display:"flex", gap:20 }}>
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20, width:200, flexShrink:0, textAlign:"center", alignSelf:"flex-start" }}>
          <div style={{ fontSize:48, marginBottom:8 }}>👤</div>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, fontSize:16, color:T.inkNavy }}>Aromal Vasanth</div>
          <div style={{ fontSize:12, color:T.slate, marginBottom:12 }}>Member since Jan 2026</div>
          {["Orders","Wishlist","Addresses","Settings"].map(s => (
            <button key={s} style={{ display:"block", width:"100%", background:T.parchment, border:"none", borderRadius:8, padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", color:T.walnut, marginBottom:6, textAlign:"left" }}>{s}</button>
          ))}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20, marginBottom:16 }}>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>My Orders</div>
            {ORDERS.slice(0,3).map(o => (
              <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                <div>
                  <div style={{ fontWeight:700, color:T.inkNavy, fontSize:13 }}>{o.book}</div>
                  <div style={{ fontSize:11, color:T.slate }}>{o.id} · {o.date}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <StatusBadge status={o.status} />
                  <div style={{ fontSize:12, fontWeight:800, color:T.inkNavy, marginTop:3 }}>₹{o.amount}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20 }}>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, fontWeight:800, color:T.inkNavy, marginBottom:16 }}>Wishlist ({wishlist.length})</div>
            {wishlist.length === 0 ? (
              <div style={{ textAlign:"center", padding:24, color:T.slateLight }}>
                <div style={{ fontSize:32, marginBottom:8 }}>♡</div>
                <div style={{ fontSize:13 }}>Save books you love</div>
              </div>
            ) : BOOKS.filter(b => wishlist.includes(b.id)).map(b => (
              <div key={b.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ fontSize:22 }}>{b.img}</span>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:13, fontWeight:700, color:T.inkNavy }}>{b.title}</div>
                    <div style={{ fontSize:11, color:T.slate }}>{b.author}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontWeight:800, color:T.inkNavy }}>₹{b.price}</span>
                  <button onClick={() => addToCart(b)} style={{ background:T.inkNavy, color:"#fff", border:"none", borderRadius:6, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Add</button>
                  <button onClick={() => toggleWishlist(b.id)} style={{ background:T.red+"15", color:T.red, border:"none", borderRadius:6, padding:"5px 8px", fontSize:11, fontWeight:700, cursor:"pointer" }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"Inter, system-ui, sans-serif", background:T.paperWhite, minHeight:"100vh", color:T.walnut }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input, select, button { font-family: Inter, system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F0EDE6; }
        ::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 3px; }
        @keyframes float0 { from { transform: translateY(0) rotate(-10deg); } to { transform: translateY(-12px) rotate(-10deg); } }
        @keyframes float1 { from { transform: translateY(0) rotate(5deg); } to { transform: translateY(-8px) rotate(5deg); } }
        @keyframes float2 { from { transform: translateY(0) rotate(-3deg); } to { transform: translateY(-15px) rotate(-3deg); } }
        @keyframes float3 { from { transform: translateY(0) rotate(12deg); } to { transform: translateY(-10px) rotate(12deg); } }
        @keyframes float4 { from { transform: translateY(0) rotate(-8deg); } to { transform: translateY(-6px) rotate(-8deg); } }
        @keyframes float5 { from { transform: translateY(0) rotate(4deg); } to { transform: translateY(-14px) rotate(4deg); } }
      `}</style>

      <Nav />

      {view === "home" && <HomePage />}
      {view === "shop" && <ShopPage />}
      {view === "admin" && <AdminPage />}
      {view === "account" && <AccountPage />}

      {/* Book Modal */}
      <Modal book={selectedBook} onClose={() => setSelectedBook(null)} onAddCart={addToCart} />

      {/* Cart Drawer */}
      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty} />
      {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.3)", zIndex:140 }} />}

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)",
          background:toast.color, color:"#fff", borderRadius:12, padding:"12px 24px",
          fontSize:13, fontWeight:700, zIndex:300,
          boxShadow:"0 8px 30px rgba(0,0,0,.2)",
          animation:"slideUp .3s ease"
        }}>{toast.msg}</div>
      )}

      <style>{`@keyframes slideUp { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
