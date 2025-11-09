import { createFileRoute } from '@tanstack/react-router'
import { Baby } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRuleStore } from '@/store/rule-store';

export const Route = createFileRoute('/demo/')({
  component: RouteComponent,
});


function RouteComponent() {

  return (
    <div className="relative min-h-screen bg-neutral-200 flex flex-col items-center justify-center gap-8">
      <RuleNotes />
      <Card />
    </div>
  );
}
// Components
const RuleNotes = () => {

  const rules: string[] = [
    "If Vegan is selected, Keto Diet cannot be selected but Dairy and Seafood Allergy can be.",
    "Dairy Allergy can be combined with any other.",
    "Seafood Allergy can be combined with any other.",
    "Keto Diet conflicts with Vegan but is compatible with Diary and Seafood Allergy.",
  ]

  return (
    <div className='w-[400px] bg-white border border-dashed border-neutral-400 p-4 rounded-lg'>
      <h2 className='text-xl font-semibold tracking-tight'>Rulebook</h2>
      <div className='divide-y divide-neutral-300 flex flex-col'>
        {rules.map((rule, _) => (
          <div key={rule} className='flex items-center gap-4 py-2'>
            <Baby className='text-black h-4 w-4 flex-shrink-0 flex-grow-0' />
            <p className='text-neutral-600 tracking-tight text-sm'>{rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const Card = () => {

  const isVeganAllowed = useRuleStore(action => action.checkStatus("Vegan"));
  const isDairyAllowed = useRuleStore(action => action.checkStatus("Dairy Allergy"));
  const isSeafoodAllowed = useRuleStore(action => action.checkStatus("Seafood Allergy"));
  const isKetoAllowed = useRuleStore(action => action.checkStatus("Keto Diet"));

  return (
    <div className='bg-white border border-dashed border-neutral-400 p-4 rounded-lg flex flex-col divide-y divide-neutral-300 gap-2'>
      <h2 className='text-black font-semibold tracking-tight text-xl'>Form</h2>
      <div className='grid grid-cols-2 gap-2'>

        {/* Form Fields Start */}
        <div className='flex justify-between'>
          <Label htmlFor='vegan'>Vegan</Label>
          <Switch disabled={!isVeganAllowed} id="vegan" className='mx-2' />
        </div>
        <div className='flex justify-between'>
          <Label htmlFor='dairy'>Dairy Allergy</Label>
          <Switch disabled={!isDairyAllowed} id="dairy" className='mx-2' />
        </div>
        <div className='flex justify-between'>
          <Label htmlFor='seafood'>Seafood Allergy</Label>
          <Switch disabled={!isSeafoodAllowed} id="seafood" className='mx-2' />
        </div>
        <div className='flex justify-between'>
          <Label htmlFor='keto'>Keto Diet</Label>
          <Switch disabled={!isKetoAllowed} id="keto" onCheckedChange={() => {
          }} className='mx-2' />
        </div>
        {/* Form Fields End */}

      </div>
    </div>
  );
}
