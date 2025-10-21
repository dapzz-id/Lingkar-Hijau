import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as mobilenet from "@tensorflow-models/mobilenet";

export interface ClassificationResult {
  type: string;
  confidence: number;
  category:
    | "plastik"
    | "organik"
    | "logam"
    | "kertas"
    | "kaca"
    | "elektronik"
    | "lainnya";
  tips: string[];
}

// Daftar mapping hasil deteksi ke kategori
const classMapping: Record<
  string,
  {
    type: string;
    category:
      | "plastik"
      | "organik"
      | "logam"
      | "kertas"
      | "kaca"
      | "elektronik"
      | "lainnya";
    tips: string[];
  }
> = {
  bottle: {
    type: "Botol Plastik",
    category: "plastik",
    tips: [
      "Cuci bersih sebelum dibuang",
      "Lepas tutup dan label",
      "Keringkan sebelum dikumpulkan",
    ],
  },
  cup: {
    type: "Gelas Plastik",
    category: "plastik",
    tips: [
      "Cuci hingga bersih",
      "Pisahkan dari gelas kaca",
      "Gunakan ulang jika memungkinkan",
    ],
  },
  bowl: {
    type: "Wadah Plastik",
    category: "plastik",
    tips: [
      "Cuci dan keringkan sebelum digunakan ulang",
      "Pisahkan dari sampah organik",
    ],
  },
  bag: {
    type: "Kantong Plastik",
    category: "plastik",
    tips: [
      "Gunakan ulang untuk belanja",
      "Jangan dibakar",
      "Kumpulkan untuk ecobrick",
    ],
  },
  plate: {
    type: "Piring Kaca / Keramik",
    category: "kaca",
    tips: [
      "Tangani dengan hati-hati jika pecah",
      "Pisahkan dari kaca lain",
      "Kumpulkan di tempat daur ulang kaca",
    ],
  },
  glass: {
    type: "Gelas Kaca",
    category: "kaca",
    tips: [
      "Pastikan bersih dan tidak pecah",
      "Pisahkan dari plastik",
      "Daur ulang di pengepul kaca",
    ],
  },
  jar: {
    type: "Toples Kaca",
    category: "kaca",
    tips: [
      "Bersihkan dan keringkan",
      "Pisahkan dari kaca pecah",
      "Gunakan kembali jika masih layak",
    ],
  },
  spoon: {
    type: "Sendok Logam",
    category: "logam",
    tips: [
      "Cuci sebelum disetor",
      "Pisahkan dari plastik",
      "Kumpulkan di tempat besi bekas",
    ],
  },
  fork: {
    type: "Garpu Logam",
    category: "logam",
    tips: [
      "Pisahkan dari plastik",
      "Kumpulkan di tempat besi bekas",
      "Gunakan ulang bila masih layak",
    ],
  },
  knife: {
    type: "Pisau Logam",
    category: "logam",
    tips: [
      "Bungkus bagian tajam",
      "Setorkan ke pengepul logam",
      "Jangan buang sembarangan",
    ],
  },
  can: {
    type: "Kaleng Logam",
    category: "logam",
    tips: [
      "Bersihkan dari sisa makanan",
      "Remukkan agar hemat tempat",
      "Setorkan ke bank sampah",
    ],
  },
  book: {
    type: "Kertas / Buku",
    category: "kertas",
    tips: [
      "Pisahkan dari kertas berminyak",
      "Jangan basahi",
      "Jual ke pengepul atau daur ulang",
    ],
  },
  apple: {
    type: "Sampah Organik",
    category: "organik",
    tips: [
      "Gunakan untuk kompos",
      "Pisahkan dari plastik",
      "Masukkan ke tong kompos",
    ],
  },
  banana: {
    type: "Sampah Organik",
    category: "organik",
    tips: [
      "Gunakan kulitnya untuk kompos",
      "Pisahkan dari plastik",
      "Masukkan ke wadah organik",
    ],
  },
  carrot: {
    type: "Sayuran",
    category: "organik",
    tips: [
      "Olah menjadi kompos",
      "Pisahkan dari anorganik",
      "Gunakan untuk pupuk alami",
    ],
  },
  spinach: {
    type: "Sayuran Hijau",
    category: "organik",
    tips: [
      "Olah menjadi kompos",
      "Pisahkan dari anorganik",
      "Gunakan untuk pupuk alami",
    ],
  },
  cabbage: {
    type: "Kubis/Kol",
    category: "organik",
    tips: [
      "Olah menjadi kompos",
      "Pisahkan dari anorganik",
      "Gunakan untuk pupuk alami",
    ],
  },

  cell_phone: {
    type: "Gadget / Elektronik",
    category: "elektronik",
    tips: [
      "Jangan buang ke sampah umum",
      "Bawa ke tempat daur ulang elektronik",
      "Pisahkan dari sampah biasa",
    ],
  },
  remote: {
    type: "Perangkat Elektronik",
    category: "elektronik",
    tips: ["Gunakan kembali jika masih bisa", "Serahkan ke e-waste center"],
  },
  battery: {
    type: "Baterai Bekas",
    category: "elektronik",
    tips: [
      "Jangan dibuang ke tempat sampah umum",
      "Bawa ke tempat daur ulang baterai",
      "Pisahkan dari sampah lain",
    ],
  },
};

let cocoModel: cocoSsd.ObjectDetection | null = null;
let mobilenetModel: mobilenet.MobileNet | null = null;

export async function classifyPlasticFromImage(
  imageElement: HTMLImageElement
): Promise<ClassificationResult> {
  try {
    await tf.ready();

    if (!cocoModel)
      cocoModel = await cocoSsd.load({ base: "lite_mobilenet_v2" });
    if (!mobilenetModel)
      mobilenetModel = await mobilenet.load({ version: 2, alpha: 1.0 });

    if (!imageElement.complete || imageElement.naturalWidth === 0)
      throw new Error("Gambar belum dimuat sempurna");

    // Prediksi dari dua model
    const detections = await cocoModel.detect(imageElement);
    const mobilePred = await mobilenetModel.classify(imageElement);
    const bestMobile = mobilePred[0];
    const labelMobile = bestMobile.className.toLowerCase();

    // Fallback organik - dataset tambahan
    if (/(leaf|plant|tree|vegetable|fruit|food|flower)/.test(labelMobile)) {
      return {
        type: "Sampah Organik",
        confidence: Number((bestMobile.probability * 100).toFixed(2)),
        category: "organik",
        tips: [
          "Bisa dijadikan kompos atau pupuk",
          "Pisahkan dari plastik dan logam",
          "Gunakan sebagai pupuk tanaman",
        ],
      };
    }

    // Fallback kertas - dataset tambahan
    if (
      /(paper|book|notebook|document|page|menu|binder|envelope|certificate|text|sheet)/.test(
        labelMobile
      )
    ) {
      return {
        type: "Kertas / Dokumen",
        confidence: Number((bestMobile.probability * 100).toFixed(2)),
        category: "kertas",
        tips: [
          "Pisahkan kertas dari sampah basah atau plastik",
          "Kumpulkan kertas bekas untuk didaur ulang",
          "Gunakan kembali sisi kosong untuk catatan",
        ],
      };
    }

    if (detections.length === 0) {
      return {
        type: "Tidak Teridentifikasi",
        confidence: 0,
        category: "lainnya",
        tips: ["Gunakan gambar lebih jelas atau pencahayaan cukup"],
      };
    }

    const topDet = detections.reduce((a, b) => (a.score > b.score ? a : b));
    let detectedLabel = topDet.class.toLowerCase();

    // Kelompok objek
    const plasticLike = [
      "bottle",
      "cup",
      "bag",
      "bowl",
      "container",
      "toys",
      "teddy bear",
      "backpack",
      "suitcase",
      "hair drier",
      "umbrella",
      "toothbrush",
      "comb",
      "wallet",
      "purse",
      "hat",
      "cup",
      "bottle",
      "vase",
      "toy",
      "jar",
      "plate",
      "bowl",
    ];
    const glassLike = [
      "wine_glass",
      "glass",
      "jar",
      "plate",
      "cup",
      "bowl",
      "bottle",
      "vase",
    ];
    const metalLike = [
      "knife",
      "fork",
      "spoon",
      "can",
      "scissors",
      "toaster",
      "sink",
      "clock",
      "vase",
      "trophy",
      "traffic_light",
      "fire_hydrant",
      "stop_sign",
      "parking_meter",
      "bench",
      "bicycle",
      "bus",
      "car",
      "motorcycle",
      "train",
      "truck",
      "airplane",
      "boat",
      "fire_extinguisher",
    ];
    const organicLike = [
      "apple",
      "banana",
      "carrot",
      "food",
      "vegetable",
      "fruit",
      "leaf",
      "plant",
      "tree",
      "flower",
      "bread",
      "meat",
      "egg",
      "salad",
      "mushroom",
      "onion",
      "spinach",
      "potato",
      "broccoli",
      "pepper",
      "potato",
      "rice",
      "sandwich",
      "watermelon",
      "cabbage",
      "corn",
      "cucumber",
      "grape",
      "lemon",
      "orange",
      "peach",
      "pear",
      "pineapple",
      "tomato",
      "broccoli",
      "cherry",
      "chili",
      "coconut",
      "date",
      "fig",
      "kiwi",
      "lime",
      "mango",
      "papaya",
      "plum",
      "raspberry",
      "strawberry",
      "tangerine",
      "zucchini",
      "pumpkin",
    ];
    const electronicLike = [
      "cell_phone",
      "remote",
      "battery",
      "charger",
      "laptop",
      "television",
      "keyboard",
      "mouse",
      "camera",
      "speaker",
      "headphones",
      "console",
      "printer",
      "tablet",
      "watch",
      "microwave",
      "refrigerator",
      "toaster",
      "oven",
      "fan",
      "air_conditioner",
      "vacuum_cleaner",
      "router",
      "projector",
    ];

    // 🔹 Pembeda bahan dasar (plastik / kaca / logam)
    if (["cup", "bottle", "glass"].includes(detectedLabel)) {
      if (/(glass|crystal|wine)/.test(labelMobile)) detectedLabel = "glass";
      else if (/(plastic|disposable)/.test(labelMobile)) detectedLabel = "cup";
    }

    if (["plate", "bowl"].includes(detectedLabel)) {
      if (/(ceramic|porcelain)/.test(labelMobile)) detectedLabel = "plate";
      else if (/(plastic|disposable)/.test(labelMobile)) detectedLabel = "bowl";
    }

    // Temukan mapping kategori
    let mappedClass = classMapping[detectedLabel];
    if (!mappedClass) {
      if (plasticLike.includes(detectedLabel))
        mappedClass = classMapping["bottle"];
      else if (glassLike.includes(detectedLabel))
        mappedClass = classMapping["glass"];
      else if (metalLike.includes(detectedLabel))
        mappedClass = classMapping["spoon"];
      else if (organicLike.includes(detectedLabel))
        mappedClass = classMapping["apple"];
      else if (electronicLike.includes(detectedLabel))
        mappedClass = classMapping["cell_phone"];
      else
        mappedClass = {
          type: detectedLabel,
          category: "lainnya",
          tips: ["Belum teridentifikasi otomatis", "Pilih kategori manual"],
        };
    }

    const formattedType = mappedClass.type
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const combinedScore =
      (topDet.score * 0.6 + bestMobile.probability * 0.4) * 100;

    return {
      type: formattedType,
      confidence: Number(combinedScore.toFixed(2)),
      category: mappedClass.category,
      tips: mappedClass.tips,
    };
  } catch (error) {
    console.error("Classification error:", error);
    throw new Error(
      `Gagal mengklasifikasi sampah: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
