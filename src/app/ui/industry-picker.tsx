import { chooseProjectIndustry } from "@/app/actions/projects";
import { INDUSTRIES, type Industry } from "@/lib/industries";

type IndustryPickerProps = {
  selected?: Industry | string | null;
};

export function IndustryPicker({ selected }: IndustryPickerProps) {
  return (
    <form action={chooseProjectIndustry}>
      <fieldset>
        <legend className="text-lg font-medium text-[var(--ink)]">
          Choose a type of project to work on
        </legend>
        <p className="mt-2 text-[var(--muted)]">
          Pick an industry. You can change this at any time.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => {
            const isSelected = selected === industry;

            return (
              <button
                key={industry}
                type="submit"
                name="industry"
                value={industry}
                aria-pressed={isSelected}
                className={`rounded-[18px] border px-4 py-4 text-left transition ${
                  isSelected
                    ? "border-[var(--accent)] bg-[#f0f6ff] shadow-[0_0_0_3px_rgba(0,113,227,0.16)]"
                    : "border-[var(--line)] bg-white hover:border-[#b8b8be]"
                }`}
              >
                <span className="block font-medium">{industry}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
    </form>
  );
}
