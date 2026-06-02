const mongoose=require('mongoose');
const subjectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    marks:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    total:{
        type:Number,
        default:100
    }
});
const studentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
        },
        name:{
            type:String,
            required: true,
            
        },
        rollNumber:{
            type:String,
            required:true,
            unique:true

        },
        class:{
            type:String,
            required:true,
        },
        subjects:[subjectSchema]
},{timestamps:true});
// Virtual: calculate percentage
studentSchema.virtual('percentage').get(function() {
  if (!this.subjects || this.subjects.length === 0) return 0;
  const obtained = this.subjects.reduce((sum, s) => sum + s.marks, 0);
  const total    = this.subjects.reduce((sum, s) => sum + s.total, 0);
  return total > 0 ? ((obtained / total) * 100).toFixed(2) : 0;
});

// Virtual: calculate grade
studentSchema.virtual('grade').get(function() {
  if (!this.subjects || this.subjects.length === 0) return 'N/A';
  const obtained = this.subjects.reduce((sum, s) => sum + s.marks, 0);
  const total    = this.subjects.reduce((sum, s) => sum + s.total, 0);
  const pct = total > 0 ? (obtained / total) * 100 : 0;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
});

studentSchema.set('toJSON',   { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);