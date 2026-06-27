from pymongo import MongoClient
import pandas as pd

client = MongoClient("mongodb://localhost:27017")
db = client["groceries"]
goods_collection = db["goods"]

# INR_TO_EUR = 0.010

# df = pd.read_csv("D:/VGU/4-SummerSemester26/programming-exercise/groceries/src/main/resources/datasets/BigBasket.csv")

# df = df.drop_duplicates(subset=["ProductName"])

# total = 0

# for category, group in df.groupby("Category"):

#     sample = group.sample(frac=1/6, random_state=42)

#     for _, row in sample.iterrows():

#         price = round(float(row["Price"]) * INR_TO_EUR, 2)

#         goods_collection.insert_one({
#             "name": row["ProductName"],
#             "description": row["Quantity"],
#             "price": price,
#             "category": row["Category"],
#             "imgUrl": row["Image_Url"],
#             "storeId": "1234"
#         })

#         total += 1

df = pd.read_csv("D:/VGU/4-SummerSemester26/programming-exercise/groceries/src/main/resources/datasets/BigBasket.csv")

groups = df.groupby("Category")

category_count = len(groups)
 
print(df["Category"].unique())
# for _, row in df.iterrows(): 
#     #  -- Walmart dataset -- 
#     db.goods.insert_one({ 
#       "name": row["product_name"], 
#       "description": row["description"], 
#       "price": row["final_price"], 
#       "category": row["root_category_name"], 
#       "imgUrl": row["main_image"], 
#       "storeId": "5678" })