import connectDB from "../src/lib/mongodb";
import Product from "../src/models/Product";
import Property from "../src/models/Property";
import { deleteImagesByUrls, deleteCloudinaryFolder } from "../src/lib/cloudinary";

async function main() {
  const args = process.argv.slice(2);
  const dropProductsOnly = args.includes("--products");
  const dropPropertiesOnly = args.includes("--properties");
  const cleanAllFolder = args.includes("--all") || args.includes("--folder");

  console.log("=================================================");
  console.log("   KHURJADEALS — DROP / CLEANUP DATABASE & ASSETS");
  console.log("=================================================");

  try {
    const mongooseConn = await connectDB();
    console.log("Connected to MongoDB successfully.");

    let totalDeletedImages = 0;

    // 1. Process Products
    if (!dropPropertiesOnly) {
      console.log("\nSearching for all Product records and images...");
      const products = await Product.find({}).select("images title").lean();
      const productImages: string[] = products.flatMap((p: any) =>
        Array.isArray(p.images) ? p.images : []
      );

      console.log(`Found ${products.length} products with ${productImages.length} attached images.`);

      if (productImages.length > 0) {
        console.log("Deleting attached product images from Cloudinary...");
        const result = await deleteImagesByUrls(productImages);
        console.log(`Cloudinary result: ${result.deleted} deleted, ${result.failed} failed.`);
        totalDeletedImages += result.deleted;
      }

      console.log("Dropping 'products' collection...");
      try {
        await Product.collection.drop();
        console.log("Successfully dropped 'products' collection.");
      } catch (err: any) {
        console.log("Collection drop notice:", err?.message || err);
        const delRes = await Product.deleteMany({});
        console.log(`Cleared ${delRes.deletedCount} products via deleteMany.`);
      }
    }

    // 2. Process Properties
    if (!dropProductsOnly) {
      console.log("\nSearching for all Property records and images...");
      const properties = await Property.find({}).select("images title").lean();
      const propertyImages: string[] = properties.flatMap((p: any) =>
        Array.isArray(p.images) ? p.images : []
      );

      console.log(`Found ${properties.length} properties with ${propertyImages.length} attached images.`);

      if (propertyImages.length > 0) {
        console.log("Deleting attached property images from Cloudinary...");
        const result = await deleteImagesByUrls(propertyImages);
        console.log(`Cloudinary result: ${result.deleted} deleted, ${result.failed} failed.`);
        totalDeletedImages += result.deleted;
      }

      console.log("Dropping 'properties' collection...");
      try {
        await Property.collection.drop();
        console.log("Successfully dropped 'properties' collection.");
      } catch (err: any) {
        console.log("Collection drop notice:", err?.message || err);
        const delRes = await Property.deleteMany({});
        console.log(`Cleared ${delRes.deletedCount} properties via deleteMany.`);
      }
    }

    // 3. Clean entire Cloudinary folder if requested
    if (cleanAllFolder) {
      console.log("\nCleaning entire 'khurjadeals' Cloudinary folder...");
      const folderRes = await deleteCloudinaryFolder("khurjadeals");
      console.log(`Cleaned ${folderRes.totalDeleted} items from 'khurjadeals' folder.`);
      totalDeletedImages += folderRes.totalDeleted;
    }

    console.log("\n=================================================");
    console.log(`Cleanup completed successfully! Total images deleted: ${totalDeletedImages}`);
    console.log("=================================================");
  } catch (error) {
    console.error("Failed to drop database / assets:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
