"""
Extract component prices from web search results.
For each component, scan snippets and find Naira-denominated prices.
Print a consolidated price table.
"""
import json, re, os, glob

PRICE_DIR = "/home/z/my-project/assets/prices"

# Pattern to match Naira amounts: ₦2,500 or N2,500 or #2,500 or "Naira 2,500"
NAIRA_PATTERNS = [
    r"(?:\u20A6|N|NGN)\s?(\d{1,3}(?:[,\u00A0]\d{3})+|\d{3,6})\b",
    r"\b(\d{1,3}(?:,\d{3})+|\d{3,5})\s?(?:naira|NGN)\b",
]

def extract_prices(text):
    """Return list of integer prices found in text."""
    prices = []
    for pat in NAIRA_PATTERNS:
        for m in re.finditer(pat, text, re.IGNORECASE):
            raw = m.group(1).replace(",", "").replace("\u00A0", "")
            try:
                p = int(raw)
                if 50 <= p <= 200000:  # sanity filter
                    prices.append(p)
            except ValueError:
                pass
    return prices

def summarise(file_path):
    with open(file_path) as f:
        data = json.load(f)
    # The structure may be a list directly, or wrapped
    results = data if isinstance(data, list) else data.get("results", data.get("data", []))
    if not isinstance(results, list):
        return None, []

    all_prices = []
    snippets = []
    for r in results[:8]:
        name = r.get("name", "")
        snippet = r.get("snippet", "")
        host = r.get("host_name", "")
        url = r.get("url", "")
        combined = f"{name} | {snippet}"
        prices = extract_prices(combined)
        if prices:
            all_prices.extend(prices)
            snippets.append({
                "host": host,
                "name": name[:90],
                "snippet": snippet[:160],
                "prices": prices[:3],
            })

    summary = None
    if all_prices:
        all_prices.sort()
        n = len(all_prices)
        median = all_prices[n // 2]
        mean = round(sum(all_prices) / n)
        summary = {
            "count": n,
            "min": min(all_prices),
            "max": max(all_prices),
            "median": median,
            "mean": mean,
        }
    return summary, snippets

def main():
    files = sorted(glob.glob(os.path.join(PRICE_DIR, "*.json")))
    print(f"{'Component':<25} {'Min':<10} {'Median':<10} {'Max':<10} {'Mean':<10} {'#prices':<8}")
    print("-" * 80)
    consolidated = {}
    for f in files:
        name = os.path.splitext(os.path.basename(f))[0].replace("_v2", "")
        summary, snippets = summarise(f)
        if summary:
            consolidated[name] = {
                "min": summary["min"],
                "median": summary["median"],
                "max": summary["max"],
                "mean": summary["mean"],
                "sources": snippets[:3],
            }
            print(f"{name:<25} \u20A6{summary['min']:<9,} \u20A6{summary['median']:<9,} \u20A6{summary['max']:<9,} \u20A6{summary['mean']:<9,} {summary['count']:<8}")
        else:
            print(f"{name:<25} (no prices found)")
    # Save consolidated
    with open(os.path.join(PRICE_DIR, "_consolidated.json"), "w") as f:
        json.dump(consolidated, f, indent=2)
    print(f"\nConsolidated data saved to {PRICE_DIR}/_consolidated.json")

if __name__ == "__main__":
    main()
