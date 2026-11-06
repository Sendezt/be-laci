import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly supabase: SupabaseService) {}

  // Upload file ke bucket product-images
  // Return: {path, publicUrl}
  async uploadProductImage(
    file: Express.Multer.File,
    productId: string,
  ): Promise<{ path: string; publicUrl: string }> {
    const ext = this.getExtension(file.originalname, file.mimetype);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `products/${productId}/${fileName}`;
    const client = this.supabase.getClient();

    const { error } = await client.storage
      .from(BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) {
      this.logger.error(`Upload gagal: ${error.message}`);
      throw new BadRequestException('Gagal mengunggah gambar');
    }

    const { data } = client.storage.from(BUCKET).getPublicUrl(path);

    return { path, publicUrl: data.publicUrl };
  }

  //   Hapus file dari bucket berdasarkan path yang tersimpan di Db
  async deleteByPath(path: string): Promise<void> {
    const client = this.supabase.getClient();
    const { error } = await client.storage.from(BUCKET).remove([path]);
    if (error) {
      // Tidak throw error - kalau file sudah tidak ada, jangan gagalkan request
      this.logger.warn(`Hapus file gagal: ${error.message}`);
    }
  }

  // Ekstrak path dari public URL. Berguna saat akan menghapus file lama
  //   Contoh: https://xxx.supabase.co/storage/v1/object/public/product-images/products/uuid/file.jpg
  //    *       → products/uuid/file.jpg
  extractPathFromUrl(publicUrl: string): string | null {
    const marker = `storage/v1/object/public/${BUCKET}`;
    const idx = publicUrl.indexOf(marker);
    return idx === -1 ? null : publicUrl.slice(idx + marker.length);
  }

  private getExtension(originalName: string, mime: string): string {
    const fromName = originalName.split('.').pop()?.toLocaleLowerCase();
    if (fromName && fromName.length <= 5) return fromName;

    //Fallback dari mime
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    return map[mime] ?? 'bin';
  }
}
