import type { SkillIconPreset } from '@portfolio/shared';
import { useRef, useState } from 'react';
import { Button } from './ui/Button';

type SkillIconPickerProps = {
  value: string;
  onChange: (iconUrl: string) => void;
  presets: SkillIconPreset[];
  onUpload: (file: File) => Promise<string>;
  disabled?: boolean;
};

export function SkillIconPicker({
  value,
  onChange,
  presets,
  onUpload,
  disabled,
}: SkillIconPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(file: File | undefined) {
    if (!file) {
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  return (
    <div className="skill-icon-picker">
      <div className="skill-icon-picker__preview">
        {value ? (
          <img src={value} alt="" className="skill-icon-picker__img" />
        ) : (
          <span className="skill-icon-picker__placeholder">Icon</span>
        )}
      </div>
      <div className="skill-icon-picker__actions">
        <Button
          type="button"
          variant="secondary"
          loading={uploading}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Upload image
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="skill-icon-picker__file"
          disabled={disabled || uploading}
          onChange={(e) => void handleFileChange(e.target.files?.[0])}
        />
        {uploadError ? (
          <p className="field-error" role="alert">{uploadError}</p>
        ) : null}
      </div>
      <p className="skill-icon-picker__label">Or choose a preset</p>
      <div className="skill-icon-picker__grid">
        {presets.map((preset) => {
          const selected = value === preset.iconUrl;
          return (
            <button
              key={preset.id}
              type="button"
              className={`skill-icon-picker__tile${selected ? ' is-selected' : ''}`}
              title={preset.label}
              disabled={disabled}
              onClick={() => onChange(preset.iconUrl)}
            >
              <img src={preset.iconUrl} alt={preset.label} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
