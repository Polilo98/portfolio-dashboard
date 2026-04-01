from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

app = FastAPI()

# CORS (frontend bağlanabilsin diye)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test endpoint
@app.get("/")
def root():
    return {"message": "API çalışıyor"}

# Tek hisse fiyatı
@app.get("/price")
def get_price(symbol: str):
    stock = yf.Ticker(symbol)
    data = stock.history(period="1d")

    if data.empty:
        return {"error": "symbol bulunamadı"}

    price = data["Close"].iloc[-1]
    return {"symbol": symbol, "price": float(price)}


# Portföy verisi (RAM'de tutuluyor)
portfolio = []


# Portföye ekleme
@app.post("/portfolio/add")
def add_asset(symbol: str, quantity: float):
    symbol = symbol.upper()

    stock = yf.Ticker(symbol)
    data = stock.history(period="1d")

    if data.empty:
        return {"error": "symbol bulunamadı"}

    price = data["Close"].iloc[-1]

    # 🔥 merge logic
    for existing in portfolio:
        if existing["symbol"] == symbol:
            existing["quantity"] += quantity
            return existing

    asset = {
        "symbol": symbol,
        "quantity": quantity,
        "price": float(price),
        "total": float(price * quantity)
    }

    portfolio.append(asset)
    return asset


# Portföyü güncel fiyatlarla döndür
@app.get("/portfolio")
def get_portfolio():
    updated_portfolio = []

    for asset in portfolio:
        symbol = asset["symbol"].upper()
        stock = yf.Ticker(symbol)
        data = stock.history(period="1d")

        if data.empty:
            continue

        price = data["Close"].iloc[-1]

        updated_asset = {
            "symbol": asset["symbol"],
            "quantity": asset["quantity"],
            "price": float(price),
            "total": float(price * asset["quantity"])
        }

        updated_portfolio.append(updated_asset)

    return updated_portfolio